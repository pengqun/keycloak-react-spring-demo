package io.github.pengqun

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.Customizer
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.web.server.SecurityWebFilterChain
import org.springframework.security.web.server.header.XFrameOptionsServerHttpHeadersWriter


/**
 * @see <a href="https://docs.spring.io/spring-security/reference/reactive/oauth2/resource-server/index.html">Docs</a>
 * @author pengqun
 */
@Configuration
@EnableWebFluxSecurity
class SecurityConfig {

    @Bean
    fun securityWebFilterChain(http: ServerHttpSecurity): SecurityWebFilterChain {
        return http
            .authorizeExchange { exchange ->
                exchange.pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                    .pathMatchers("/hello/public").permitAll()
                    .pathMatchers("/hello/private").authenticated()
                    .pathMatchers("/actuator/health").permitAll()
                    .anyExchange().denyAll()
            }
            .headers { headers ->
                headers.contentTypeOptions { }
                headers.frameOptions { it.mode(XFrameOptionsServerHttpHeadersWriter.Mode.DENY) }
                headers.hsts { it.includeSubdomains(true).maxAge(java.time.Duration.ofSeconds(31536000)) }
            }
            .oauth2ResourceServer { oauth2 ->
                oauth2.jwt(Customizer.withDefaults())
            }
            .build()
    }
}