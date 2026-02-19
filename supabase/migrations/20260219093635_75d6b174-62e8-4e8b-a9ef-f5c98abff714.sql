
-- Drop overly permissive policies
DROP POLICY "Service role can insert notifications" ON public.notifications;
DROP POLICY "Service role can read push subscriptions" ON public.push_subscriptions;

-- The edge function uses service_role key which bypasses RLS, so no permissive policy needed
