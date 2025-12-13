import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'No authorization header', verified: false }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a client with the user's JWT to get their ID
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify the JWT and get user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      console.error('Invalid token or user not found:', userError?.message);
      return new Response(
        JSON.stringify({ error: 'Invalid token', verified: false }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body to get required roles
    const { requiredRoles } = await req.json();
    
    if (!requiredRoles || !Array.isArray(requiredRoles)) {
      console.error('No required roles specified');
      return new Response(
        JSON.stringify({ error: 'Required roles must be specified as an array', verified: false }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Query user roles from database using service role (bypasses RLS)
    const { data: userRoles, error: rolesError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    if (rolesError) {
      console.error('Error fetching user roles:', rolesError.message);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch roles', verified: false }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const roles = userRoles?.map(r => r.role) || [];
    const hasRequiredRole = requiredRoles.some(role => roles.includes(role));

    console.log(`User ${user.id} roles: ${roles.join(', ')}. Required: ${requiredRoles.join(', ')}. Verified: ${hasRequiredRole}`);

    return new Response(
      JSON.stringify({ 
        verified: hasRequiredRole, 
        userRoles: roles,
        userId: user.id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error in verify-role:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', verified: false }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
