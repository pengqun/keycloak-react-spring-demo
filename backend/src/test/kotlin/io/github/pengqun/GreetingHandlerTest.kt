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
class GreetingHandlerTest {

    @Autowired
    private lateinit var webTestClient: WebTestClient

    @Test
    fun `helloPublic returns greeting for stranger`() {
        webTestClient.get().uri("/hello/public")
            .exchange()
            .expectStatus().isOk
            .expectBody()
            .jsonPath("$.message").isEqualTo("Hello, stranger!")
            .jsonPath("$.requestId").isNotEmpty
            .jsonPath("$.token").doesNotExist()
    }

    @Test
    fun `helloPrivate returns greeting with username from JWT`() {
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
            .expectBody()
            .jsonPath("$.message").isEqualTo("Hello, testuser!")
            .jsonPath("$.requestId").isNotEmpty
            .jsonPath("$.token").isNotEmpty
            .jsonPath("$.token.claims.preferred_username").isEqualTo("testuser")
    }

    @Test
    fun `helloPrivate includes token metadata in response`() {
        webTestClient
            .mutateWith(
                mockJwt().jwt { jwt ->
                    jwt.claim("preferred_username", "admin")
                        .issuedAt(Instant.now())
                        .expiresAt(Instant.now().plusSeconds(300))
                }
            )
            .get().uri("/hello/private")
            .exchange()
            .expectStatus().isOk
            .expectBody()
            .jsonPath("$.token.issueAt").isNotEmpty
            .jsonPath("$.token.expiresAt").isNotEmpty
            .jsonPath("$.token.headers").isNotEmpty
            .jsonPath("$.token.claims").isNotEmpty
    }
}
