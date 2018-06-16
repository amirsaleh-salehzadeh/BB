package app.AIengine.dataprepration;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.jblas.DoubleMatrix;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class RecordData {
	public static int outTimer = 0;

	public static void main(String[] arString) {
		prepareObjects("C:\\RecordingFiles\\");
		// labelTheRows(null, 3559316);
	}

	public static void recordMainTask(String value, boolean append, String fileName) {
		value = value.replaceAll("\\]", "");
		value = value.replaceAll("\\[", "");
		ArrayList<String> StringEMGCollector = new ArrayList<String>();
		StringEMGCollector.add(value);
		ExcelDataStorage ds = new ExcelDataStorage();
		ds.insertDataToTheFile(StringEMGCollector, append, fileName);

	}

	private static TreeMap<Integer, Object> mapLabels;
	private static Map<String, TreeMap<Integer, Object>> allItems;

	private static void convertFileToObj(String line, String fileName) {
		Map<String, Object> object = new HashMap<String, Object>();
		String[] vals = line.split("__");
		if (vals.length <= 1)
			return;
		Map<String, Object> mappedAttributes = new HashMap<String, Object>();
		Gson g = new Gson();
		// try {
		// if (!mapper.readValue(vals[1], new HashMap<String,
		// Object>().getClass()).isEmpty()) {
		// mappedAttributes = mapper.readValue(vals[1], Map.class);
		// mappedAttributes = g.fromJson(vals[1], Map.class);
		JsonParser jp = new JsonParser();
		JsonObject jobj = null;
		ArrayList listFromGSON = null;
		if (vals[1].indexOf("[") >= 0) {
			listFromGSON = g.fromJson(vals[1], ArrayList.class);
			System.out.println(listFromGSON.size());
			for (int i = 0; i < listFromGSON.size(); i++) {
				System.out.println(listFromGSON.get(i));
				mappedAttributes = g.fromJson(listFromGSON.get(i).toString(), Map.class);
				Iterator it = mappedAttributes.entrySet().iterator();
				Map<String, Object> tmp = new HashMap<String, Object>();
				while (it.hasNext()) {
					Map.Entry pair = (Map.Entry) it.next();
					it.remove();
					if (!fileName.contains("0_"))
						tmp.put(pair.getKey().toString() + i, pair.getValue());
					else
						tmp.put(pair.getKey().toString(), pair.getValue());
				}
				object.putAll(tmp);
			}
		} else
			jobj = jp.parse(vals[1]).getAsJsonObject();
		if (!fileName.contains("0_")) {
			Map<String, Object> label = labelTheRows(Integer.parseInt(vals[0]));
			if (label == null)
				return;
			// Map<String, Object> labelsObj = mapper.readValue(vals[1], new HashMap<String,
			// Object>().getClass());
			object.putAll(label);
			if (allItems.get(fileName) == null)
				allItems.put(fileName, new TreeMap<Integer, Object>());
			allItems.get(fileName).put(Integer.parseInt(vals[0]), object);
			System.out.println(object.toString());
		}
		if (fileName.contains("0_")) {
			mapLabels.put(Integer.parseInt(vals[0]), object);
		} else
			ExcelDataStorage.createReportExcelFile("test" + fileName, object, Integer.parseInt(vals[0]));
	}

	private static Map<String, Object> labelTheRows(int time) {
		Map<String, Object> res = new HashMap<String, Object>();
		Map.Entry<Integer, Object> low = mapLabels.floorEntry(time);
		Map.Entry<Integer, Object> high = mapLabels.ceilingEntry(time);
		Object closest = null;
		int closestTime = -1;
		if (low != null && high != null) {
			closest = Math.abs(time - low.getKey()) < Math.abs(time - high.getKey()) ? low.getValue() : high.getValue();
			closestTime = Math.abs(time - low.getKey()) < Math.abs(time - high.getKey()) ? low.getKey() : high.getKey();
		} else if (low != null || high != null) {
			closest = low != null ? low.getValue() : high.getValue();
			closestTime = low != null ? low.getKey() : high.getKey();
		}
		if (Math.abs(time - closestTime) > 1000)
			return null;
		ObjectMapper mapper = new ObjectMapper();
		System.out.println(closest.toString() + " is the closest one to " + time);
		// try {
		// res = mapper.readValue(closest.toString(), new ArrayList.class);
		// } catch (JsonParseException e) {
		// e.printStackTrace();
		// } catch (JsonMappingException e) {
		// e.printStackTrace();
		// } catch (IOException e) {
		// e.printStackTrace();
		// }
		return (Map<String, Object>) closest;
	}

	public static void prepareObjects(String rootFolder) {
		// ArrayList<Map<String, Map<String, String>>> values = new ArrayList<>();
		File dir = new File(rootFolder);
		File[] files = dir.listFiles();
		for (int i = 0; i < files.length; i++) {
			BufferedReader inputStream = null;
			if (files[i].getName().contains("Exce"))
				continue;
			try {
				inputStream = new BufferedReader(new FileReader(files[i]));
			} catch (FileNotFoundException e1) {
				e1.printStackTrace();
			}
			String line;
			try {
				if (mapLabels == null)
					mapLabels = new TreeMap<Integer, Object>();
				if (allItems == null)
					allItems = new HashMap<String, TreeMap<Integer, Object>>();
				while ((line = inputStream.readLine()) != null) {
					if (line.length() <= 5)
						continue;
					convertFileToObj(line, files[i].getName());
				}
				ExcelDataStorage.generateReport();
				System.out.println("hey");
				inputStream.close();
			} catch (JsonGenerationException e) {
				e.printStackTrace();
			} catch (JsonMappingException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

}
