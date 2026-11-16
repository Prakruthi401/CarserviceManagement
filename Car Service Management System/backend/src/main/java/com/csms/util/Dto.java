package com.csms.util;

import java.util.LinkedHashMap;
import java.util.Map;

/** JSON response map with explicit Object values and support for optional null fields. */
public final class Dto {
    private Dto() {}

    public static Map<String, Object> map(Object... pairs) {
        if (pairs.length % 2 != 0) {
            throw new IllegalArgumentException("Expected key/value pairs");
        }
        Map<String, Object> result = new LinkedHashMap<>();
        for (int i = 0; i < pairs.length; i += 2) {
            result.put((String) pairs[i], pairs[i + 1]);
        }
        return result;
    }
}
