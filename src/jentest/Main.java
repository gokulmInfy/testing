package jentest;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
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
		// TODO Auto-generated method stub
		System.out.print("Hello World \n");
		String x = null;
		Properties prop = new Properties();
		InputStream input = null;

		 try {

				DefaultHttpClient httpClient = new DefaultHttpClient();
				HttpPost postRequest = new HttpPost(
					"http://localhost:8000/execution_task/");

				StringEntity input = new StringEntity("{\"auth_token\": \"ac2e1ab0-0805-45df-af1f-a82f070ba9b7\", \"job_id\": 1}");
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
					x=(String) json.get("report_id");
					System.out.println("---report_id "+x);
				 } catch (ParseException e) {
    				   	System.out.println("--some exception handler code.-");
					e.printStackTrace();
 			  	 }

			  } catch (MalformedURLException e) {

				e.printStackTrace();

			  } catch (IOException e) {

				e.printStackTrace();

			  }
		 boolean report_ready = false;
		 while(!report_ready){
			 String status = makeGetcall(x);
			 if(status != null && status.contains("true")){
				 report_ready = true; 
			 }else{
				 TimeUnit.SECONDS.sleep(5);
			 }
		 }
			Properties prop = new Properties();
			OutputStream output1 = null;
			try {

				output1 = new FileOutputStream("config.properties");

				// set the properties value
				prop.setProperty("awesomeness", "!");
				prop.setProperty("report_id", x);
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

			}

	private static String makeGetcall(String reportid) {
		String status = null;
		try {
			
			DefaultHttpClient httpClient = new DefaultHttpClient();
			HttpGet getRequest = new HttpGet(
				"http://localhost:8000/report_test/reportid");
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
					status=(String) json.get("status");
					System.out.println("---status "+status);
				 } catch (ParseException e) {
 				   	System.out.println("--GET some exception handler code.-");
					e.printStackTrace();
			  	 }

		  } catch (ClientProtocolException e) {

			e.printStackTrace();

		  } catch (IOException e) {

			e.printStackTrace();
		  }
		
		return status;
		
	}
	
}
