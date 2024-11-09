// CardComponents.tsx
import { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
}

export function Card({ children }: CardProps) {
  return <div className="rounded-lg bg-white p-4 shadow-md">{children}</div>
}

export function CardHeader({ children }: CardProps) {
  return <div className="mb-4 border-b pb-2">{children}</div>
}

export function CardTitle({ children }: CardProps) {
  return <h2 className="text-xl font-semibold">{children}</h2>
}

export function CardContent({ children }: CardProps) {
  return <div>{children}</div>
}
