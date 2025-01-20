package Allrecipes.Recipesdemo.Security.JWT;

import Allrecipes.Recipesdemo.Entities.UserDetails;
import Allrecipes.Recipesdemo.Entities.Enums.UserType;
import io.jsonwebtoken.*;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import javax.security.auth.login.LoginException;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JWT {

    // ====================================================
    // 1) Use HS384 to match your token's header (HS384)
    //    If your token is actually HS256, switch to HS256.
    // ====================================================
    private String signatureAlgorithm = SignatureAlgorithm.HS384.getJcaName();

    // ====================================================
    // 2) Your secret key for signing/validation
    // ====================================================
    private String encodedSecretKey = "jwt+secret+key+is+used+for+signing+and+validating+tokens+in+the+app";

    // This decodes the Base64 key and uses your chosen algorithm
    private Key decodedSecretKey = new SecretKeySpec(
            Base64.getDecoder().decode(encodedSecretKey),
            this.signatureAlgorithm
    );

    // ====================================================
    // Generate token from UserDetails object
    // ====================================================
    public String generateToken(UserDetails userData) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userType", userData.getUserType());
        claims.put("userName", userData.getUserName());
        claims.put("id", userData.getUserId());
        return createToken(claims, userData.getEmail());
    }

    // ====================================================
    // Generate token from an existing token (refresh style)
    // ====================================================
    public String generateToken(String token) {
        Map<String, Object> claims = new HashMap<>();
        Claims ourClaims = extractAllClaims(token);
        claims.put("userName", ourClaims.get("userName"));
        claims.put("userType", ourClaims.get("userType"));
        claims.put("id", ourClaims.get("id"));
        return createToken(claims, ourClaims.getSubject());
    }

    // ====================================================
    // Create the actual JWT string
    // ====================================================
    private String createToken(Map<String, Object> claims, String email) {
        Instant now = Instant.now();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plus(30, ChronoUnit.MINUTES))) // 30 min expiry
                .signWith(this.decodedSecretKey)
                .compact();
    }

    // ====================================================
    // Extract all claims from a token
    // ====================================================
    public Claims extractAllClaims(String token) throws ExpiredJwtException, SignatureException {
        JwtParser jwtParser = Jwts.parserBuilder()
                .setSigningKey(decodedSecretKey)
                .build();
        return jwtParser.parseClaimsJws(token).getBody();
    }

    // ====================================================
    // Extract subject = user's email
    // ====================================================
    public String extractEmail(String token) throws SignatureException {
        return extractAllClaims(token).getSubject();
    }

    // ====================================================
    // Check if token is expired
    // ====================================================
    public boolean isTokenExpired(String token) {
        try {
            extractAllClaims(token);
            return false;
        } catch (ExpiredJwtException err) {
            return true;
        }
    }

    // ====================================================
    // Extract userType from the token
    // ====================================================
    public String getUserType(String token) {
        Claims claims = extractAllClaims(token);
        return (String) claims.get("userType");
    }

    // ====================================================
    // Validate the token against given user details
    // ====================================================
    public boolean validateToken(String token, UserDetails userDetails) throws MalformedJwtException, SignatureException {
        final String userEmail = extractEmail(token);
        return (userEmail.equals(userDetails.getEmail()) && !isTokenExpired(token));
    }

    // ====================================================
    // Validate token has correct signature & not expired
    // ====================================================
    public boolean validateToken(String token) throws MalformedJwtException, SignatureException {
        // If no exception is thrown by extractAllClaims, token is valid
        extractAllClaims(token);
        return true;
    }

    // ====================================================
    // Check user type after validating the token
    // ====================================================
    public boolean checkUser(String tokenWithoutBearer, UserType requiredUserType) throws LoginException {
        // 1) Validate the token
        if (validateToken(tokenWithoutBearer)) {
            // 2) Compare user types
            if (!getUserType(tokenWithoutBearer).equals(requiredUserType.name())) {
                throw new LoginException("User not allowed");
            }
        }
        return true;
    }

    // ====================================================
    // If you ever want to build new headers for a new token
    // ====================================================
    public HttpHeaders getHeaders(String rawTokenWithoutBearer) {
        HttpHeaders headers = new HttpHeaders();
        if (validateToken(rawTokenWithoutBearer)) {
            // generate a refreshed token
            String newToken = generateToken(rawTokenWithoutBearer);
            headers.set("Authorization", "Bearer " + newToken);
        }
        return headers;
    }

    // ====================================================
    // Extract custom userDetails from the token
    // ====================================================
    public UserDetails getUserDetails(String rawTokenWithoutBearer) throws LoginException {
        if (!validateToken(rawTokenWithoutBearer)) {
            throw new LoginException("Invalid or expired token.");
        }

        Claims claims = extractAllClaims(rawTokenWithoutBearer);
        Long userId = claims.get("id", Long.class);
        String userName = claims.get("userName", String.class);
        String userTypeString = claims.get("userType", String.class);

        UserType userType;
        try {
            userType = UserType.valueOf(userTypeString);
        } catch (IllegalArgumentException e) {
            throw new LoginException("Invalid user type in token.");
        }

        return UserDetails.builder()
                .userId(userId)
                .userName(userName)
                .email(claims.getSubject())
                .userType(userType)
                .build();
    }
}
