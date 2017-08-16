package jentest;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import java.util.Properties;
import java.util.concurrent.TimeUnit;
import java.io.FileOutputStream;
import java.io.OutputStream;

public class Main {

	public static void main(String[] args) {
		
		String report_id = null, hostUrl = args[0], jobId = args[1];
		
		for (String s: args) {           
			
	        	System.out.println(s); 
    		}
		if (hostUrl != null && jobId != null)
		{		
		try {
			DefaultHttpClient httpClient = new DefaultHttpClient();
			HttpPost postRequest = new HttpPost(hostUrl);
				//"http://localhost:8000/execution_task/");
			StringEntity input = new StringEntity("{\"auth_token\": \"ac2e1ab0-0805-45df-af1f-a82f070ba9b7\", \"job_id\":"+jobId+"}");
			input.setContentType("application/json");
			postRequest.setEntity(input);
			HttpResponse response = httpClient.execute(postRequest);

			if (response.getStatusLine().getStatusCode() != 200) {
				throw new RuntimeException("Failed : HTTP error code : "
					+ response.getStatusLine().getStatusCode());
			}

			BufferedReader br = new BufferedReader(
				new InputStreamReader((response.getEntity().getContent())));

			String output;
			StringBuilder jsonBuilder = new StringBuilder();
			System.out.println("Output from Server .... \n");
			while ((output = br.readLine()) != null) {
				jsonBuilder.append(output);
			}
			System.out.println(jsonBuilder.toString());
			httpClient.getConnectionManager().shutdown();
			try {
				JSONObject json = (JSONObject) new JSONParser().parse(jsonBuilder.toString());
				report_id=(String) json.get("report_id");
				System.out.println("---report_id "+report_id);
			} catch (ParseException e) {
				System.out.println("--some exception handler code.-");
				e.printStackTrace();
 			}
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		if ( report_id != null ) {
			boolean report_ready = false;
		 	while(!report_ready){
				boolean report_status = getReportStatus(report_id);
			 	if(report_status){
					report_ready = true;
			 	}else{
					try {
				 		TimeUnit.SECONDS.sleep(10);
				 	} catch(InterruptedException e){
				 		e.printStackTrace();
				 	}
			 	}
			}
		}
		Properties prop = new Properties();
		OutputStream output1 = null;
		try {
			output1 = new FileOutputStream("config.properties");
			// set the properties value
			prop.setProperty("report_id", report_id);
			// save properties to project root folder
			prop.store(output1, null);
		} catch (IOException io) {
			io.printStackTrace();
		} finally {
			if (output1 != null) {
				try {
					output1.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		}else{
			System.out.println("Accepting 2 arguments hostUrl and jobId, cannot be null"); 
		}
	}

	private static boolean getReportStatus(String reportid) {
		boolean report_status = false;
		try {
			DefaultHttpClient httpClient = new DefaultHttpClient();
			HttpGet getRequest = new HttpGet(
				"http://localhost:8000/report_test/" + reportid );
			getRequest.addHeader("accept", "application/json");
			HttpResponse response = httpClient.execute(getRequest);

			if (response.getStatusLine().getStatusCode() != 200) {
				throw new RuntimeException("Failed : HTTP error code : "
				   + response.getStatusLine().getStatusCode());
			}

			BufferedReader br = new BufferedReader(
	                         new InputStreamReader((response.getEntity().getContent())));
			String output;
			StringBuilder jsonBuilder = new StringBuilder();
			System.out.println("Output from Server .... \n");
			while ((output = br.readLine()) != null) {
				
				jsonBuilder.append(output);
			}
			System.out.println("get response: "+ jsonBuilder.toString());
			httpClient.getConnectionManager().shutdown();
			try {
				JSONObject json = (JSONObject) new JSONParser().parse(jsonBuilder.toString());
				report_status = (boolean)json.get("status");
				System.out.println("---report_status "+report_status);
			} catch (ParseException e) {
				System.out.println("--GET some exception handler code.-");
				e.printStackTrace();
			}
		} catch (ClientProtocolException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return report_status;
	}
}
