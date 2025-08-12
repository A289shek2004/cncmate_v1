import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDefectSchema } from "@shared/schema";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

const defectFormSchema = insertDefectSchema.extend({
  type: z.string().min(1, "Defect type is required"),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  description: z.string().min(1, "Description is required"),
  machineId: z.string().min(1, "Machine selection is required"),
  jobId: z.string().optional(),
});

type DefectFormData = z.infer<typeof defectFormSchema>;

interface DefectModalProps {
  isOpen: boolean;
  onClose: () => void;
  machines: Array<{ id: string; name: string }>;
  jobs?: Array<{ id: string; jobNumber: string }>;
}

export function DefectModal({ isOpen, onClose, machines, jobs = [] }: DefectModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<DefectFormData>({
    resolver: zodResolver(defectFormSchema),
    defaultValues: {
      type: '',
      severity: 'medium',
      description: '',
      machineId: '',
      jobId: '',
    }
  });

  const createDefectMutation = useMutation({
    mutationFn: async (data: DefectFormData) => {
      await apiRequest("POST", "/api/defects", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/defects"] });
      toast({
        title: "Success",
        description: "Defect logged successfully",
      });
      reset();
      onClose();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to log defect",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: DefectFormData) => {
    createDefectMutation.mutate(data);
  };

  const defectTypes = [
    "Surface Roughness",
    "Dimension Variance",
    "Tool Marks",
    "Burr Formation",
    "Crack",
    "Porosity",
    "Chipping",
    "Other"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full" data-testid="dialog-defect-log">
        <DialogHeader>
          <DialogTitle data-testid="title-log-defect">Log Quality Issue</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" data-testid="form-defect-log">
          <div>
            <Label htmlFor="type" className="block text-sm font-medium text-neutral-700 mb-2">
              Defect Type
            </Label>
            <Select 
              onValueChange={(value) => setValue('type', value)}
              value={watch('type')}
            >
              <SelectTrigger data-testid="select-defect-type">
                <SelectValue placeholder="Select defect type" />
              </SelectTrigger>
              <SelectContent>
                {defectTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-error-600 text-sm mt-1" data-testid="error-defect-type">
                {errors.type.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="severity" className="block text-sm font-medium text-neutral-700 mb-2">
              Severity
            </Label>
            <Select 
              onValueChange={(value) => setValue('severity', value as 'low' | 'medium' | 'high' | 'critical')}
              value={watch('severity')}
            >
              <SelectTrigger data-testid="select-defect-severity">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="machineId" className="block text-sm font-medium text-neutral-700 mb-2">
              Machine
            </Label>
            <Select 
              onValueChange={(value) => setValue('machineId', value)}
              value={watch('machineId')}
            >
              <SelectTrigger data-testid="select-machine">
                <SelectValue placeholder="Select machine" />
              </SelectTrigger>
              <SelectContent>
                {machines.map((machine) => (
                  <SelectItem key={machine.id} value={machine.id}>
                    {machine.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.machineId && (
              <p className="text-error-600 text-sm mt-1" data-testid="error-machine">
                {errors.machineId.message}
              </p>
            )}
          </div>

          {jobs.length > 0 && (
            <div>
              <Label htmlFor="jobId" className="block text-sm font-medium text-neutral-700 mb-2">
                Related Job (Optional)
              </Label>
              <Select 
                onValueChange={(value) => setValue('jobId', value)}
                value={watch('jobId')}
              >
                <SelectTrigger data-testid="select-job">
                  <SelectValue placeholder="Select related job" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No related job</SelectItem>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.jobNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
              Description
            </Label>
            <Textarea
              {...register('description')}
              placeholder="Describe the issue in detail..."
              rows={3}
              data-testid="textarea-description"
            />
            {errors.description && (
              <p className="text-error-600 text-sm mt-1" data-testid="error-description">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              data-testid="button-cancel-defect"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-error-600 text-white hover:bg-error-700"
              disabled={createDefectMutation.isPending || !isValid}
              data-testid="button-submit-defect"
            >
              {createDefectMutation.isPending ? "Logging..." : "Log Defect"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
