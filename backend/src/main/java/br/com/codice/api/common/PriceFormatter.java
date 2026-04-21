package br.com.codice.api.common;

import java.text.NumberFormat;
import java.util.Locale;

public final class PriceFormatter {

    private static final Locale PT_BR = new Locale("pt", "BR");

    private PriceFormatter() {
    }

    public static String format(int cents) {
        NumberFormat nf = NumberFormat.getCurrencyInstance(PT_BR);
        return nf.format(cents / 100.0);
    }
}
