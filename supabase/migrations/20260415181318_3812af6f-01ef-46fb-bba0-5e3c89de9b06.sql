
-- Create handoff_status enum
CREATE TYPE public.handoff_status AS ENUM ('not_started', 'ready_for_handoff', 'handed_off', 'accepted');

-- Add depends_on_task_id column
ALTER TABLE public.tasks
  ADD COLUMN depends_on_task_id uuid REFERENCES public.tasks(id);

-- Add handoff_status column
ALTER TABLE public.tasks
  ADD COLUMN handoff_status public.handoff_status NOT NULL DEFAULT 'not_started';

-- Index for dependency lookups
CREATE INDEX idx_tasks_depends_on ON public.tasks(depends_on_task_id) WHERE depends_on_task_id IS NOT NULL;
