// File generated from our OpenAPI spec

declare module 'https://esm.sh/stripe@14.14.0/types/index.d.ts' {
  namespace Stripe {
    interface MandateRetrieveParams {
      /**
       * Specifies which fields in the response should be expanded.
       */
      expand?: Array<string>;
    }

    class MandatesResource {
      /**
       * Retrieves a Mandate object.
       */
      retrieve(
        id: string,
        params?: MandateRetrieveParams,
        options?: RequestOptions
      ): Promise<Stripe.Response<Stripe.Mandate>>;
      retrieve(
        id: string,
        options?: RequestOptions
      ): Promise<Stripe.Response<Stripe.Mandate>>;
    }
  }
}
