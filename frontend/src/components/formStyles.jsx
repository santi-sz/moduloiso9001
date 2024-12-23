// formStyles.js
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    fontFamily: "Roboto-Regular",
  },
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
  },
  inputContainer: {
    marginBottom: 20,
    color: "#808080",
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: "#2E8B57",
  },
  selectedText: {
    fontSize: 16,
    color: "#00000",
  },
  input: {
    height: 45,
    borderColor: "#2E8B57",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    fontWeight: "ultralight",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  dropdown: {
    width: "100%",
    height: 45,
    borderColor: "#2E8B57",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    fontFamily: "Roboto-Regular",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    height: 45,
    backgroundColor: "#2E8B57",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20, // Añade un margen inferior para separar los botones
    width: "80%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Roboto-Regular",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginTop: 5,
    textAlign: "center"
  },
});

export default styles;