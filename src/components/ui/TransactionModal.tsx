'use client';

import { Fragment } from 'react';
import { XCircle, CheckCircle2, Loader2, ExternalLink, RefreshCw, ArrowRight } from 'lucide-react';
import { BLOCK_EXPLORERS } from '@/config/contracts';
import { Modal } from "./Modal";

// Helper function since we're having issues with imports
const getBlockExplorerURL = (chainId: number): string => {
  return BLOCK_EXPLORERS[chainId as keyof typeof BLOCK_EXPLORERS] || BLOCK_EXPLORERS[80002]; // Default to Polygon Amoy
};

export interface Step {
  id: string;
  title: string;
  description: string;
  status: "pending" | "loading" | "success" | "error";
  txHash?: string;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  steps: Step[];
  currentStep: number;
  isComplete: boolean;
  chainId?: number;
  errorMessage?: string;
  onComplete?: () => void;
  onRetry?: () => void;
  canRetry?: boolean;
  onNextStep?: () => void;
  canProceedToNextStep?: boolean;
}

export default function TransactionModal({
  isOpen,
  onClose,
  title,
  steps,
  currentStep,
  isComplete,
  chainId,
  errorMessage,
  onComplete,
  onRetry,
  canRetry = false,
  onNextStep,
  canProceedToNextStep = false
}: TransactionModalProps) {
  
  const getStepIcon = (status: Step["status"], isActive: boolean) => {
    switch (status) {
      case "pending":
        return (
          <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center ${isActive ? "border-blue-500 bg-blue-500/10" : "border-gray-600"}`}>
            <span className={`text-sm font-medium ${isActive ? "text-blue-400" : "text-gray-500"}`}>
              {steps.findIndex(s => s.status === "pending") + 1}
            </span>
          </div>
        );
      case "loading":
        return (
          <div className="h-8 w-8 rounded-full bg-blue-500/10 border-2 border-blue-500 flex items-center justify-center">
            <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
          </div>
        );
      case "success":
        return (
          <div className="h-8 w-8 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 text-green-400" />
          </div>
        );
      case "error":
        return (
          <div className="h-8 w-8 rounded-full bg-red-500/10 border-2 border-red-500 flex items-center justify-center">
            <XCircle className="h-5 w-5 text-red-400" />
          </div>
        );
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
      preventBackdropClose={
        steps.some(step => step.status === 'loading' || step.status === 'pending') &&
        !isComplete
      }
    >
      <div className="space-y-6 py-2">
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isPast = index < currentStep;
            const txUrl = step.txHash && chainId ? `${getBlockExplorerURL(chainId)}/tx/${step.txHash}` : null;
            
            return (
              <Fragment key={step.id}>
                <div className={`flex items-start gap-4 p-4 rounded-lg ${isActive ? "bg-gray-800" : ""}`}>
                  <div className="flex-shrink-0">
                    {getStepIcon(step.status, isActive)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-base font-medium ${step.status === "error" ? "text-red-300" : isActive || isPast || step.status === "success" ? "text-gray-200" : "text-gray-400"}`}>
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-400">{step.description}</p>
                    
                    {step.status === "error" && (
                      <div className="mt-2 flex items-center">
                        <span className="text-sm text-red-400">Transaction failed or was rejected</span>
                        {onRetry && canRetry && (
                          <button 
                            onClick={onRetry}
                            className="ml-3 flex items-center text-sm text-blue-400 hover:text-blue-300 focus:outline-none"
                          >
                            <RefreshCw className="h-3.5 w-3.5 mr-1" />
                            Retry
                          </button>
                        )}
                      </div>
                    )}
                    
                    {txUrl && (
                      <a 
                        href={txUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 flex items-center text-sm text-blue-400 hover:text-blue-300"
                      >
                        View Transaction <ExternalLink className="h-3.5 w-3.5 ml-1" />
                      </a>
                    )}
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="h-8 ml-4 border-l border-gray-700" />
                )}
              </Fragment>
            );
          })}
        </div>
        
        {isComplete ? (
          <div className="flex justify-end mt-6">
            <button 
              onClick={onComplete || onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium"
            >
              Complete
            </button>
          </div>
        ) : (
          <div className="flex justify-between mt-6">
            <div className="text-sm text-gray-400">
              {steps.filter(s => s.status === "success").length} of {steps.length} complete
            </div>
            
            <div className="flex gap-3">
              {canProceedToNextStep && onNextStep && (
                <button 
                  onClick={onNextStep}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium flex items-center"
                >
                  <ArrowRight className="h-4 w-4 mr-2" /> Continue to Next Step
                </button>
              )}
              
              {canRetry && onRetry && steps.some(s => s.status === "error") ? (
                <button 
                  onClick={onRetry}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium flex items-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" /> Retry
                </button>
              ) : (
                <button 
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white font-medium"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
} 