package com.security;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import javax.xml.bind.DatatypeConverter;
import java.math.BigInteger;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.Arrays;

/**
 * This class is used to hash passwords using PBKDF2
 */
public class PasswordHasher
{

	private int salt_byte_size = 128;
	private int hash_byte_size = 512;
	private int iterations = 1000;

	private String secRandInst = "SHA1PRNG";
	private String secKeyInst = "PBKDF2WithHmacSHA512";

	private String hash;
	private String salt;

	/**
	 * This method is used to generate an initial hash with only a password string
	 * A securely random salt is generated and stored for insertion into the user database
	 *
	 * @param password
	 */
	public void hashPassword(String password)
	{
		System.out.println(password);
		char passChars[] = password.toCharArray();
		byte saltBytes[] = genSalt();

		hashPassword(passChars, saltBytes);
	}

	/**
	 * This method is used to generate a hash from a password and provided salt
	 * to be used when validating existing passwords
	 *
	 * @param password
	 * @param salt
	 */
	public void hashPassword(String password, String salt)
	{
		char passChars[] = password.toCharArray();
		byte saltBytes[] = parseHex(salt);

		hashPassword(passChars, saltBytes);
	}

	/**
	 * This method is used to create the PBKD2F hash
	 *
	 * @param passChars
	 * @param saltBytes
	 */
	private void hashPassword(char passChars[], byte saltBytes[])
	{
		PBEKeySpec keySpec = new PBEKeySpec(passChars, saltBytes, iterations, hash_byte_size);

		SecretKeyFactory keyFactory = null;

		try
		{
			keyFactory = SecretKeyFactory.getInstance(secKeyInst);
		} catch (NoSuchAlgorithmException ex)
		{
			ex.printStackTrace();
		}

		byte hashBytes[] = null;

		try
		{
			hashBytes = keyFactory.generateSecret(keySpec).getEncoded();
		} catch (InvalidKeySpecException ex)
		{
			ex.printStackTrace();
		}

		this.hash = DatatypeConverter.printHexBinary(hashBytes);
		this.salt = DatatypeConverter.printHexBinary(saltBytes);
	}

	/**
	 * This method is used to generate a securely random salt
	 *
	 * @return Returns byte array containing random salt
	 */
	private byte[] genSalt()
	{
		SecureRandom sr = null;

		try
		{
			sr = SecureRandom.getInstance(secRandInst);
		} catch (NoSuchAlgorithmException ex)
		{
			ex.printStackTrace();
		}

		byte randBytes[] = new byte[salt_byte_size];

		sr.nextBytes(randBytes);

		return randBytes;
	}

	public String getHash()
	{
		return this.hash;
	}

	public String getSalt()
	{
		return this.salt;
	}

	/**
	 * Because of an issue in recent jdk versions, {@link DatatypeConverter#parseHexBinary(String)} throws an NPE.
	 * http://stackoverflow.com/questions/16437570/nullpointerexception-when-using-datatypeconverter-parsehexbinary
	 */
	private byte[] parseHex(String str)
	{
		byte[] a = new BigInteger(str, 16).toByteArray();
		if (a.length != str.length() / 2)
		{
			a = Arrays.copyOfRange(a, 1, a.length);
		}
		return a;
	}

}