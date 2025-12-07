
def parse_weather_code(code):
    # Parse weather code to human-readable description
    if code == 0:
        return "Céu limpo"
    elif code in [1, 2]:
        return "Parcialmente nublado"
    elif code == 3:
        return "Nublado"
    elif code in [45, 48]:
        return "Neblina"
    elif code in [51, 53, 55, 56, 57]:
        return "Chuvisco"
    elif code in [61, 63, 65, 66, 67, 80, 81, 82]:
        return "Chuva"
    elif code in [71, 73, 75, 77, 85, 86]:
        return "Neve"
    elif code in [95, 96, 99]:
        return "Tempestade"
    else:
        return "Céu limpo"

def convert_numpy_to_python(value):
    # Convert numpy types to native Python types
    if hasattr(value, "item"):
        return value.item()
    return value
