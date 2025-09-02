import { createClient } from '@/lib/supabase/server'
import { deletePoll, createPoll, updatePoll } from '../polls'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Mock the Supabase client
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

// Mock Next.js functions
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>
const mockRevalidatePath = revalidatePath as jest.MockedFunction<typeof revalidatePath>
const mockRedirect = redirect as jest.MockedFunction<typeof redirect>

describe('Poll Actions', () => {
  let mockSupabase: any

  beforeEach(() => {
    mockSupabase = {
      auth: {
        getUser: jest.fn(),
      },
      from: jest.fn(() => ({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(),
          })),
        })),
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(),
          })),
        })),
        delete: jest.fn(() => ({
          eq: jest.fn(),
        })),
        update: jest.fn(() => ({
          eq: jest.fn(),
        })),
      })),
    }

    mockCreateClient.mockResolvedValue(mockSupabase)
    jest.clearAllMocks()
  })

  describe('deletePoll', () => {
    const mockPollId = 'test-poll-id'
    const mockUserId = 'test-user-id'

    it('successfully deletes a poll owned by the user', async () => {
      // Mock authenticated user
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: mockUserId } },
        error: null,
      })

      // Mock poll ownership check
      const mockFrom = mockSupabase.from()
      mockFrom.select().eq().single.mockResolvedValue({
        data: { created_by: mockUserId },
        error: null,
      })

      // Mock successful deletion
      mockFrom.delete().eq.mockResolvedValue({
        error: null,
      })

      const result = await deletePoll(mockPollId)

      expect(result).toEqual({ success: true })
      expect(mockRevalidatePath).toHaveBeenCalledWith('/polls')
      expect(mockRevalidatePath).toHaveBeenCalledWith('/dashboard')
    })

    it('throws error when user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: new Error('Not authenticated'),
      })

      await expect(deletePoll(mockPollId)).rejects.toThrow('You must be logged in to delete a poll')
    })

    it('throws error when poll is not found', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: mockUserId } },
        error: null,
      })

      const mockFrom = mockSupabase.from()
      mockFrom.select().eq().single.mockResolvedValue({
        data: null,
        error: new Error('Poll not found'),
      })

      await expect(deletePoll(mockPollId)).rejects.toThrow('Poll not found')
    })

    it('throws error when user tries to delete poll they do not own', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: mockUserId } },
        error: null,
      })

      const mockFrom = mockSupabase.from()
      mockFrom.select().eq().single.mockResolvedValue({
        data: { created_by: 'different-user-id' },
        error: null,
      })

      await expect(deletePoll(mockPollId)).rejects.toThrow('You can only delete your own polls')
    })

    it('throws error when deletion fails', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: mockUserId } },
        error: null,
      })

      const mockFrom = mockSupabase.from()
      mockFrom.select().eq().single.mockResolvedValue({
        data: { created_by: mockUserId },
        error: null,
      })

      mockFrom.delete().eq.mockResolvedValue({
        error: new Error('Database error'),
      })

      await expect(deletePoll(mockPollId)).rejects.toThrow('Failed to delete poll')
    })
  })

  describe('createPoll', () => {
    const mockUserId = 'test-user-id'

    it('successfully creates a poll with valid data', async () => {
      const formData = new FormData()
      formData.append('title', 'Test Poll')
      formData.append('description', 'Test Description')
      formData.append('allowMultipleVotes', 'on')
      formData.append('expiresAt', '2024-12-31T23:59:59.000Z')
      formData.append('option-0', 'Option 1')
      formData.append('option-1', 'Option 2')

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: mockUserId } },
        error: null,
      })

      const mockFrom = mockSupabase.from()
      mockFrom.insert().select().single.mockResolvedValue({
        data: { id: 'new-poll-id' },
        error: null,
      })

      mockFrom.insert.mockResolvedValue({
        error: null,
      })

      await createPoll(formData)

      expect(mockRevalidatePath).toHaveBeenCalledWith('/polls')
      expect(mockRevalidatePath).toHaveBeenCalledWith('/dashboard')
      expect(mockRedirect).toHaveBeenCalledWith('/polls?created=true')
    })

    it('throws error when title is missing', async () => {
      const formData = new FormData()
      formData.append('description', 'Test Description')
      formData.append('option-0', 'Option 1')
      formData.append('option-1', 'Option 2')

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: mockUserId } },
        error: null,
      })

      await expect(createPoll(formData)).rejects.toThrow('Poll title is required')
    })

    it('throws error when less than 2 options are provided', async () => {
      const formData = new FormData()
      formData.append('title', 'Test Poll')
      formData.append('option-0', 'Option 1')

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: mockUserId } },
        error: null,
      })

      await expect(createPoll(formData)).rejects.toThrow('At least 2 options are required')
    })

    it('throws error when user is not authenticated', async () => {
      const formData = new FormData()
      formData.append('title', 'Test Poll')
      formData.append('option-0', 'Option 1')
      formData.append('option-1', 'Option 2')

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: new Error('Not authenticated'),
      })

      await expect(createPoll(formData)).rejects.toThrow('You must be logged in to create a poll')
    })
  })

  describe('updatePoll', () => {
    const mockPollId = 'test-poll-id'
    const mockUserId = 'test-user-id'

    it('successfully updates a poll owned by the user', async () => {
      const formData = new FormData()
      formData.append('pollId', mockPollId)
      formData.append('title', 'Updated Poll')
      formData.append('description', 'Updated Description')
      formData.append('allowMultipleVotes', 'on')
      formData.append('expiresAt', '2024-12-31T23:59:59.000Z')
      formData.append('option-0', 'Updated Option 1')
      formData.append('option-1', 'Updated Option 2')

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: mockUserId } },
        error: null,
      })

      const mockFrom = mockSupabase.from()
      mockFrom.select().eq().single.mockResolvedValue({
        data: { created_by: mockUserId },
        error: null,
      })

      mockFrom.update().eq.mockResolvedValue({
        error: null,
      })

      mockFrom.delete().eq.mockResolvedValue({
        error: null,
      })

      mockFrom.insert.mockResolvedValue({
        error: null,
      })

      const result = await updatePoll(formData)

      expect(result).toEqual({ success: true })
      expect(mockRevalidatePath).toHaveBeenCalledWith('/polls')
      expect(mockRevalidatePath).toHaveBeenCalledWith('/dashboard')
      expect(mockRevalidatePath).toHaveBeenCalledWith(`/polls/${mockPollId}`)
    })

    it('throws error when user tries to update poll they do not own', async () => {
      const formData = new FormData()
      formData.append('pollId', mockPollId)
      formData.append('title', 'Updated Poll')
      formData.append('option-0', 'Updated Option 1')
      formData.append('option-1', 'Updated Option 2')

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: mockUserId } },
        error: null,
      })

      const mockFrom = mockSupabase.from()
      mockFrom.select().eq().single.mockResolvedValue({
        data: { created_by: 'different-user-id' },
        error: null,
      })

      await expect(updatePoll(formData)).rejects.toThrow('You can only update your own polls')
    })

    it('throws error when poll is not found', async () => {
      const formData = new FormData()
      formData.append('pollId', mockPollId)
      formData.append('title', 'Updated Poll')
      formData.append('option-0', 'Updated Option 1')
      formData.append('option-1', 'Updated Option 2')

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: mockUserId } },
        error: null,
      })

      const mockFrom = mockSupabase.from()
      mockFrom.select().eq().single.mockResolvedValue({
        data: null,
        error: new Error('Poll not found'),
      })

      await expect(updatePoll(formData)).rejects.toThrow('Poll not found')
    })
  })
})
