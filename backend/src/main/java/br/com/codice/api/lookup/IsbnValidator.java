package br.com.codice.api.lookup;

public final class IsbnValidator {

    private IsbnValidator() {
    }

    public static String normalize(String raw) {
        if (raw == null) {
            return "";
        }
        return raw.replaceAll("[\\s-]", "").toUpperCase();
    }

    public static boolean isValid(String normalized) {
        if (normalized == null) {
            return false;
        }
        return switch (normalized.length()) {
            case 10 -> isValidIsbn10(normalized);
            case 13 -> isValidIsbn13(normalized);
            default -> false;
        };
    }

    private static boolean isValidIsbn10(String isbn) {
        int sum = 0;
        for (int i = 0; i < 9; i++) {
            char c = isbn.charAt(i);
            if (c < '0' || c > '9') return false;
            sum += (c - '0') * (10 - i);
        }
        char last = isbn.charAt(9);
        if (last == 'X') {
            sum += 10;
        } else if (last >= '0' && last <= '9') {
            sum += (last - '0');
        } else {
            return false;
        }
        return sum % 11 == 0;
    }

    private static boolean isValidIsbn13(String isbn) {
        int sum = 0;
        for (int i = 0; i < 13; i++) {
            char c = isbn.charAt(i);
            if (c < '0' || c > '9') return false;
            int digit = c - '0';
            sum += (i % 2 == 0) ? digit : digit * 3;
        }
        return sum % 10 == 0;
    }
}
