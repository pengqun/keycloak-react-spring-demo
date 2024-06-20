package io.github.pengqun

import org.springframework.http.MediaType
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.BodyInserters
import org.springframework.web.reactive.function.server.ServerRequest
import org.springframework.web.reactive.function.server.ServerResponse
import reactor.core.publisher.Mono
import java.time.OffsetDateTime
import java.time.ZoneId
import java.util.*


/**
 * @author pengqun
 */
@Component
class GreetingHandler() {

    fun helloPublic(request: ServerRequest): Mono<ServerResponse> {
        return ServerResponse.ok().contentType(MediaType.APPLICATION_JSON)
            .body(
                BodyInserters.fromValue(
                    Greeting(message = "Hello, stranger!")
                )
            )
    }

    fun helloPrivate(request: ServerRequest): Mono<ServerResponse> {
        return request.principal()
            .flatMap { principal ->
                val jwt = (principal as JwtAuthenticationToken).principal as Jwt
                val token = Token(
                    issueAt = OffsetDateTime.ofInstant(jwt.issuedAt, ZoneId.systemDefault()),
                    expiresAt = OffsetDateTime.ofInstant(jwt.expiresAt, ZoneId.systemDefault()),
                    headers = jwt.headers,
                    claims = jwt.claims
                )
                ServerResponse.ok().contentType(MediaType.APPLICATION_JSON)
                    .body(
                        BodyInserters.fromValue(
                            Greeting(message = "Hello, ${token.claims["preferred_username"]}!", token = token)
                        )
                    )
            }
    }

    data class Greeting(
        val requestId: String = UUID.randomUUID().toString().lowercase(),
        val message: String,
        val token: Token? = null
    )

    data class Token(
        val issueAt: OffsetDateTime,
        val expiresAt: OffsetDateTime,
        val headers: Map<String, Any>,
        val claims: Map<String, Any>
    )
}