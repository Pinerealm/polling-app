import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import { PollActions } from '../poll-actions'
import { deletePoll } from '@/lib/actions/polls'

// Mock the deletePoll action
jest.mock('@/lib/actions/polls', () => ({
  deletePoll: jest.fn(),
}))

// Mock Next.js router
const mockPush = jest.fn()
const mockRefresh = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}))

const mockDeletePoll = deletePoll as jest.MockedFunction<typeof deletePoll>

describe('PollActions', () => {
  const mockPollId = 'test-poll-id'
  
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all action buttons', () => {
    render(<PollActions pollId={mockPollId} />)
    
    expect(screen.getByRole('button', { name: /view/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
    // Delete button only has an icon, so we'll find it by testing there are 3 buttons
    expect(screen.getAllByRole('button')).toHaveLength(3)
  })

  it('navigates to poll view when View button is clicked', async () => {
    const user = userEvent.setup()
    render(<PollActions pollId={mockPollId} />)
    
    const viewButton = screen.getByRole('button', { name: /view/i })
    await user.click(viewButton)
    
    expect(mockPush).toHaveBeenCalledWith(`/polls/${mockPollId}`)
  })

  it('navigates to poll edit when Edit button is clicked', async () => {
    const user = userEvent.setup()
    render(<PollActions pollId={mockPollId} />)
    
    const editButton = screen.getByRole('button', { name: /edit/i })
    await user.click(editButton)
    
    expect(mockPush).toHaveBeenCalledWith(`/polls/${mockPollId}/edit`)
  })

  describe('Delete functionality', () => {
    it('shows confirmation dialog when delete button is first clicked', async () => {
      const user = userEvent.setup()
      render(<PollActions pollId={mockPollId} />)
      
      // Delete button is the third button (index 2)
      const buttons = screen.getAllByRole('button')
      const deleteButton = buttons[2]
      await user.click(deleteButton)
      
      expect(screen.getByText('Delete this poll?')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })

    it('calls deletePoll and refreshes when confirmed', async () => {
      const user = userEvent.setup()
      mockDeletePoll.mockResolvedValue({ success: true })
      
      render(<PollActions pollId={mockPollId} />)
      
      // First click to show confirmation
      const buttons = screen.getAllByRole('button')
      const deleteButton = buttons[2]
      await user.click(deleteButton)
      
      // Second click to confirm deletion
      const confirmButton = screen.getByRole('button', { name: /delete/i })
      await user.click(confirmButton)
      
      await waitFor(() => {
        expect(mockDeletePoll).toHaveBeenCalledWith(mockPollId)
        expect(mockRefresh).toHaveBeenCalled()
      })
    })

    it('shows loading state during deletion', async () => {
      const user = userEvent.setup()
      // Make deletePoll take some time to resolve
      mockDeletePoll.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100)))
      
      render(<PollActions pollId={mockPollId} />)
      
      // First click to show confirmation
      const buttons = screen.getAllByRole('button')
      const deleteButton = buttons[2]
      await user.click(deleteButton)
      
      // Second click to confirm deletion
      const confirmButton = screen.getByRole('button', { name: /delete/i })
      await user.click(confirmButton)
      
      // Check that the button shows loading state
      expect(screen.getByText('Deleting...')).toBeInTheDocument()
      expect(confirmButton).toBeDisabled()
    })

    it('hides confirmation dialog when cancel is clicked', async () => {
      const user = userEvent.setup()
      render(<PollActions pollId={mockPollId} />)
      
      // First click to show confirmation
      const buttons = screen.getAllByRole('button')
      const deleteButton = buttons[2]
      await user.click(deleteButton)
      
      // Click cancel
      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      await user.click(cancelButton)
      
      expect(screen.queryByText('Delete this poll?')).not.toBeInTheDocument()
    })

    it('handles delete error gracefully', async () => {
      const user = userEvent.setup()
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      mockDeletePoll.mockRejectedValue(new Error('Delete failed'))
      
      render(<PollActions pollId={mockPollId} />)
      
      // First click to show confirmation
      const buttons = screen.getAllByRole('button')
      const deleteButton = buttons[2]
      await user.click(deleteButton)
      
      // Second click to confirm deletion
      const confirmButton = screen.getByRole('button', { name: /delete/i })
      await user.click(confirmButton)
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to delete poll:', expect.any(Error))
        expect(screen.queryByText('Delete this poll?')).not.toBeInTheDocument()
      })
      
      consoleSpy.mockRestore()
    })

    it('does not call deletePoll when delete button is clicked but not confirmed', async () => {
      const user = userEvent.setup()
      render(<PollActions pollId={mockPollId} />)
      
      // First click to show confirmation
      const buttons = screen.getAllByRole('button')
      const deleteButton = buttons[2]
      await user.click(deleteButton)
      
      // Don't click confirm, just verify deletePoll wasn't called
      expect(mockDeletePoll).not.toHaveBeenCalled()
    })
  })

  describe('Button states and styling', () => {
    it('applies correct styling to delete button when not in confirmation mode', () => {
      render(<PollActions pollId={mockPollId} />)
      
      const buttons = screen.getAllByRole('button')
      const deleteButton = buttons[2]
      // Check that it has outline variant classes
      expect(deleteButton).toHaveClass('border-input')
    })

    it('applies destructive styling to delete button when in confirmation mode', async () => {
      const user = userEvent.setup()
      render(<PollActions pollId={mockPollId} />)
      
      const buttons = screen.getAllByRole('button')
      const deleteButton = buttons[2]
      await user.click(deleteButton)
      
      // After clicking, the button should have destructive styling
      expect(deleteButton).toHaveClass('bg-destructive')
    })

    it('disables delete button during pending state', async () => {
      const user = userEvent.setup()
      mockDeletePoll.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100)))
      
      render(<PollActions pollId={mockPollId} />)
      
      // First click to show confirmation
      const buttons = screen.getAllByRole('button')
      const deleteButton = buttons[2]
      await user.click(deleteButton)
      
      // Second click to confirm deletion
      const confirmButton = screen.getByRole('button', { name: /delete/i })
      await user.click(confirmButton)
      
      expect(confirmButton).toBeDisabled()
    })
  })

  describe('Accessibility', () => {
    it('has proper button labels for screen readers', () => {
      render(<PollActions pollId={mockPollId} />)
      
      expect(screen.getByRole('button', { name: /view/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
      // Delete button only has an icon, but should still be accessible
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(3)
    })

    it('confirmation dialog is accessible', async () => {
      const user = userEvent.setup()
      render(<PollActions pollId={mockPollId} />)
      
      const buttons = screen.getAllByRole('button')
      const deleteButton = buttons[2]
      await user.click(deleteButton)
      
      expect(screen.getByText('Delete this poll?')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })
  })
})
