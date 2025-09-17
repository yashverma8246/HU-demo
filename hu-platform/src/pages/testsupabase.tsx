import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const TestSupabase = () => {
  const testConnection = async () => {
    console.log("🔍 Starting Supabase connection test...");
    
    try {
      // Check if environment variables are set
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder') || supabaseKey.includes('placeholder')) {
        console.error("❌ Environment variables not properly configured");
        toast.error("❌ Supabase environment variables not found. Please create a .env.local file with your Supabase credentials.");
        return;
      }

      console.log("✅ Environment variables found");
      toast.loading("Testing Supabase connection...");

      // Test basic connection with a simple query
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .limit(1);

      toast.dismiss(); // Dismiss loading toast

      if (error) {
        if (error.message.includes("relation") || error.message.includes("does not exist")) {
          console.warn("⚠️ Projects table doesn't exist yet. This is normal for new setups.");
          toast.warning("⚠️ Supabase connected but 'projects' table not found. Please create the required tables.");
        } else if (error.message.includes("Invalid API key") || error.message.includes("JWT")) {
          console.error("❌ Invalid Supabase credentials:", error.message);
          toast.error("❌ Invalid Supabase credentials. Please check your environment variables.");
        } else {
          console.error("❌ Supabase error:", error.message);
          toast.error("❌ Supabase connection failed. Check console for details.");
        }
      } else {
        console.log("✅ Supabase data:", data);
        toast.success("✅ Supabase connected successfully!");
      }
    } catch (error: any) {
      console.error("❌ Connection test failed:", error.message);
      toast.dismiss(); // Dismiss any loading toast
      toast.error("❌ Failed to test Supabase connection. Check your environment variables.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      <div className="space-y-4">
        <div className="bg-card p-4 rounded-lg border">
          <h2 className="text-lg font-semibold mb-2">Environment Variables Status</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">VITE_SUPABASE_URL:</span> 
              <span className={`ml-2 ${import.meta.env.VITE_SUPABASE_URL ? 'text-green-600' : 'text-red-600'}`}>
                {import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Not set'}
              </span>
            </div>
            <div>
              <span className="font-medium">VITE_SUPABASE_ANON_KEY:</span> 
              <span className={`ml-2 ${import.meta.env.VITE_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-red-600'}`}>
                {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set'}
              </span>
            </div>
          </div>
        </div>
        
        <button
          onClick={testConnection}
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          Test Supabase Connection
        </button>
        
        <div className="text-sm text-muted-foreground">
          <p><strong>Note:</strong> If you see JavaScript alerts instead of toast notifications, try:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)</li>
            <li>Clear browser cache</li>
            <li>Check the browser console for detailed error messages</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestSupabase;
