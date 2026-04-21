import { cn } from '@/lib/utils'

interface StepperProps {
    steps: string[]
    currentStep: number
}

export function Stepper({ steps, currentStep }: StepperProps) {
    return (
        <>
            <div className="hidden sm:flex items-center justify-between">
                {steps.map((label, index) => {
                    const stepNumber = index + 1
                    const isCompleted = stepNumber < currentStep
                    const isCurrent = stepNumber === currentStep

                    return (
                        <div key={label} className="flex flex-1 items-center">
                            <div className="flex items-center gap-2">
                                <div
                                    className={cn(
                                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium',
                                        isCompleted && 'bg-tinta text-papel',
                                        isCurrent && 'bg-bordo text-papel',
                                        !isCompleted && !isCurrent && 'bg-cinza-borda text-cinza-quente'
                                    )}
                                >
                                    {isCompleted ? (
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        stepNumber
                                    )}
                                </div>
                                <span
                                    className={cn(
                                        'text-sm whitespace-nowrap',
                                        isCurrent ? 'font-medium text-tinta' : 'text-cinza-quente'
                                    )}
                                >
                                    {label}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={cn(
                                        'mx-3 h-px flex-1',
                                        stepNumber < currentStep ? 'bg-tinta' : 'bg-cinza-borda'
                                    )}
                                />
                            )}
                        </div>
                    )
                })}
            </div>
            <p className="text-sm text-tinta-leve sm:hidden">
                Passo {currentStep} de {steps.length}
            </p>
        </>
    )
}
