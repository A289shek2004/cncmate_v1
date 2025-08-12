import { Job } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RecentJobsProps {
  jobs: Job[];
  onViewAll?: () => void;
}

export function RecentJobs({ jobs, onViewAll }: RecentJobsProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success-100 text-success-700 text-xs font-medium">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-primary-100 text-primary-700 text-xs font-medium">In Progress</Badge>;
      case 'queued':
        return <Badge className="bg-warning-100 text-warning-700 text-xs font-medium">Queued</Badge>;
      case 'cancelled':
        return <Badge className="bg-error-100 text-error-700 text-xs font-medium">Cancelled</Badge>;
      default:
        return <Badge className="bg-neutral-100 text-neutral-700 text-xs font-medium">{status}</Badge>;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle data-testid="title-recent-jobs">Recent Jobs</CardTitle>
          <Button 
            variant="ghost" 
            className="text-primary-600 hover:text-primary-800 text-sm font-medium"
            onClick={onViewAll}
            data-testid="button-view-all-jobs"
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {jobs.length === 0 ? (
          <div className="text-center py-8 text-neutral-500" data-testid="text-no-jobs">
            <p>No jobs found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div 
                key={job.id}
                className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:shadow-sm transition-shadow"
                data-testid={`job-${job.id}`}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span 
                      className="font-medium text-neutral-900"
                      data-testid={`text-job-number-${job.id}`}
                    >
                      {job.jobNumber}
                    </span>
                    {getStatusBadge(job.status)}
                  </div>
                  <p 
                    className="text-sm text-neutral-600 mb-2"
                    data-testid={`text-job-description-${job.id}`}
                  >
                    {job.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-neutral-500">
                    <span data-testid={`text-job-operator-${job.id}`}>
                      Operator: {job.operatorId}
                    </span>
                    {job.actualDuration && (
                      <span data-testid={`text-job-duration-${job.id}`}>
                        Duration: {formatDuration(job.actualDuration)}
                      </span>
                    )}
                    {job.estimatedDuration && job.status !== 'completed' && (
                      <span data-testid={`text-job-estimated-${job.id}`}>
                        Est: {formatDuration(job.estimatedDuration)}
                      </span>
                    )}
                    <span data-testid={`text-job-machine-${job.id}`}>
                      Machine: {job.machineId}
                    </span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  {job.status === 'in_progress' ? (
                    <>
                      <p 
                        className="text-sm font-medium text-neutral-900"
                        data-testid={`text-job-progress-${job.id}`}
                      >
                        {job.progress}%
                      </p>
                      <p className="text-xs text-neutral-500">Progress</p>
                    </>
                  ) : job.completedAt ? (
                    <>
                      <p 
                        className="text-sm font-medium text-neutral-900"
                        data-testid={`text-job-completed-time-${job.id}`}
                      >
                        {formatTime(job.completedAt)}
                      </p>
                      <p 
                        className="text-xs text-neutral-500"
                        data-testid={`text-job-completed-date-${job.id}`}
                      >
                        {formatDate(job.completedAt)}
                      </p>
                    </>
                  ) : job.startedAt ? (
                    <>
                      <p 
                        className="text-sm font-medium text-neutral-900"
                        data-testid={`text-job-started-time-${job.id}`}
                      >
                        {formatTime(job.startedAt)}
                      </p>
                      <p className="text-xs text-neutral-500">Started</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-neutral-900">Queued</p>
                      <p 
                        className="text-xs text-neutral-500"
                        data-testid={`text-job-created-date-${job.id}`}
                      >
                        {formatDate(job.createdAt)}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
