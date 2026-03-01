package io.github.pengqun

import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers.mockJwt
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.reactive.server.WebTestClient
import java.time.Instant

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureWebTestClient
class SecurityConfigTest {

    @Autowired
    private lateinit var webTestClient: WebTestClient

    @Test
    fun `public endpoint is accessible without authentication`() {
        webTestClient.get().uri("/hello/public")
            .exchange()
            .expectStatus().isOk
    }

    @Test
    fun `private endpoint returns 401 without authentication`() {
        webTestClient.get().uri("/hello/private")
            .exchange()
            .expectStatus().isUnauthorized
    }

    @Test
    fun `private endpoint returns 200 with valid JWT`() {
        webTestClient
            .mutateWith(
                mockJwt().jwt { jwt ->
                    jwt.claim("preferred_username", "testuser")
                        .issuedAt(Instant.now())
                        .expiresAt(Instant.now().plusSeconds(300))
                }
            )
            .get().uri("/hello/private")
            .exchange()
            .expectStatus().isOk
    }

    @Test
    fun `unknown endpoints return 401 without authentication`() {
        webTestClient.get().uri("/unknown")
            .exchange()
            .expectStatus().isUnauthorized
    }

    @Test
    fun `unknown endpoints are denied even with authentication`() {
        webTestClient
            .mutateWith(mockJwt())
            .get().uri("/unknown")
            .exchange()
            .expectStatus().isForbidden
    }

    @Test
    fun `actuator health endpoint is accessible without authentication`() {
        webTestClient.get().uri("/actuator/health")
            .exchange()
            .expectStatus().isOk
    }
}
