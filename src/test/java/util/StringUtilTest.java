package util;

import org.junit.Test;
import org.omg.PortableInterceptor.SUCCESSFUL;

import static org.junit.Assert.*;

/**
 * Created by Matthew on 5/3/2017.
 */
public class StringUtilTest {
	@Test
	public void isNullTrue() {
		assertTrue(StringUtil.isNull(null));
	}

	@Test
	public void isNullFalse() {
		assertFalse("Not null", StringUtil.isNull(""));
	}

	@Test
	public void isEmptyTrueNull() {
		assertTrue(StringUtil.isEmpty(null));
	}

	@Test
	public void isEmptyTrueEmpty() {
		assertTrue(StringUtil.isEmpty(""));
	}

	@Test
	public void isEmptyFalse() {
		assertFalse(StringUtil.isEmpty("A"));
	}

}