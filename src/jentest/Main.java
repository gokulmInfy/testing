package jentest;

public class Main {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		System.out.print("Hello World");

		 try {

				DefaultHttpClient httpClient = new DefaultHttpClient();
				HttpPost postRequest = new HttpPost(
					"http://localhost:8000/execution_task/");

				StringEntity input = new StringEntity("{\"auth_token\": \"ac2e1ab0-0805-45df-af1f-a82f070ba9b7\", \"job_id\": 8}");
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
				System.out.println("Output from Server .... \n");
				while ((output = br.readLine()) != null) {
					System.out.println(output);
				}

				httpClient.getConnectionManager().shutdown();
				JSONObject json = (JSONObject) new JSONParser().parse(output);
				String x=(String) json.get("report_id");
				System.out.println("---report_id "+x);

			  } catch (MalformedURLException e) {

				e.printStackTrace();

			  } catch (IOException e) {

				e.printStackTrace();

			  }

			}
	
}
