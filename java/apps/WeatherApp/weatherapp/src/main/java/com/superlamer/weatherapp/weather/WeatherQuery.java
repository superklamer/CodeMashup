package com.superlamer.weatherapp.weather;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

import javax.ws.rs.client.AsyncInvoker;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Invocation;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.Response;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class WeatherQuery {
	
	private WeatherQuery() {}
	

	public static String queryWeather() throws InterruptedException, ExecutionException {
		String webURI = "https://api.openweathermap.org/data/2.5/weather";
		
		Client client = ClientBuilder.newClient();
		WebTarget target = client.target(webURI)
				 .queryParam("id", 5391811)
				 .queryParam("appid", "6a0326b54ac62aae38ee842128683084")
				 .queryParam("mode", "json")
				 .queryParam("units", "metric");
		
		Invocation.Builder reqBuilder = target.request();
		
		AsyncInvoker asyncInvoker = reqBuilder.async();
		Future<Response> futureResp = asyncInvoker.get();
		
		Response response = futureResp.get(); // block until client responds
		
		
		Weather wQuery = response.readEntity(Weather.class);
		
		GsonBuilder gsonBuilder = new GsonBuilder();  
		gsonBuilder.serializeNulls();  
		Gson gson = gsonBuilder.create();

		
		client.close();
		
		return gson.toJson(wQuery);
	}
}