package cz.skrisjak.crew_planner.shopping;

public enum MeasureUnit {
    PIECES("ks"),
    GRAMS("g"),
    KILOGRAMS("kg"),
    MILLILITRES("ml"),
    LITRES("l");

    public final String unit;
    MeasureUnit(String unit) {
        this.unit = unit;
    }
}