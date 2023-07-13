import * as Sentry from "@sentry/vue";
import { Integrations } from '@sentry/tracing'

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()
    const { vueApp } = nuxtApp;
    console.log(`vueApp: `, vueApp)
    Sentry.init({
        app: [vueApp],
        dsn: config.SENTRY_DSN as string,
        integrations: [
            new Integrations.BrowserTracing({
                routingInstrumentation: Sentry.vueRouterInstrumentation(nuxtApp.$router as any),
                tracingOrigins: ["localhost", "crisis.vmun.app", /^\//],
            }),
        ],
        logErrors: false, // Note that this doesn't seem to work with nuxt 3
        tracesSampleRate: config.SENTRY_TRACES_SAMPLE_RATE as number || 1.0, // Sentry recommends adjusting this value in production
        debug: config.SENTRY_ENABLE_DEBUG as boolean || false, // Enable debug mode
        environment: config.ENVIRONMENT as string || 'dev', // Set environment
        // The following enables exeptions to be logged to console despite logErrors being set to false (preventing them from being passed to the default Vue err handler)
        beforeSend(event, hint) {
            // Check if it is an exception, and if so, log it.
            if (event.exception) {
                console.error(`[Exeption handled by Sentry]: (${hint.originalException})`, { event, hint })
            }
            // Continue sending to Sentry
            return event;
        },
    });
    vueApp.mixin(Sentry.createTracingMixins({ trackComponents: true, timeout: 2000, hooks: ['activate', 'mount', 'update'] }))
    Sentry.attachErrorHandler(vueApp, { logErrors: false, attachProps: true, trackComponents: true, timeout: 2000, hooks: ['activate', 'mount', 'update'] });

    return {
        provide: {
            sentrySetContext: (n: string, context: any) => Sentry.setContext(n, context),
            sentrySetUser: (user: any) => Sentry.setUser(user),
            sentrySetTag: (tagName: string, value: any) => Sentry.setTag(tagName, value),
            sentryAddBreadcrumb: (breadcrumb: any) => Sentry.addBreadcrumb(breadcrumb),
        }
    }
})