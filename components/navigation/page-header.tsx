import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BarChart3 } from "lucide-react"

interface PageHeaderProps {
  title: string
  description?: string
  showBackButton?: boolean
  backHref?: string
  backLabel?: string
}

export function PageHeader({ 
  title, 
  description, 
  showBackButton = true, 
  backHref = "/dashboard",
  backLabel = "Back to Dashboard"
}: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        {showBackButton && (
          <Link href={backHref}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {backLabel}
            </Button>
          </Link>
        )}
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        </div>
      </div>
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
