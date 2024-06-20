package io.github.pengqun

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.reactive.function.server.RequestPredicates.GET
import org.springframework.web.reactive.function.server.RouterFunction
import org.springframework.web.reactive.function.server.RouterFunctions
import org.springframework.web.reactive.function.server.ServerResponse


/**
 * @author pengqun
 */
@Configuration(proxyBeanMethods = false)
class GreetingRouter {

    @Bean
    fun route(greetingHandler: GreetingHandler): RouterFunction<ServerResponse> {
        return RouterFunctions.route(GET("/hello/public")) { greetingHandler.helloPublic(it) }
            .andRoute(GET("/hello/private")) { greetingHandler.helloPrivate(it) }
    }
}