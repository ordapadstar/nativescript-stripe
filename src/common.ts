export type CardBrand = "Visa" | "Amex" | "MasterCard" | "Discover" | "JCB" | "DinersClub" | "Unknown";

export class StripeConfigCommon {
    protected static instance: StripeConfigCommon;

    static shared(): StripeConfigCommon {
        return StripeConfigCommon.instance;
    }

    backendAPI: StripeBackendAPI;

    // The Publishable Key found at https://dashboard.stripe.com/account/apikeys
    // Use "Test Publishable Key" (it looks like pk_test_abcdef) during development.
    publishableKey = "";

    // To enable Apple Pay, follow the instructions at https://stripe.com/docs/mobile/apple-pay
    // to create an Apple Merchant ID (it looks like merchant.com.yourappname).
    appleMerchantID = "";

    // See documentation for STPPaymentConfiguration for using these fields.
    // If left 'undefined' the default value will be used.
    // TODO: Don't use iOS-specific data types
    companyName: string = undefined;
    requiredBillingAddressFields: STPBillingAddressFields = undefined;
    requiredShippingAddressFields: PKAddressField = undefined;
    verifyPrefilledShippingAddress: boolean = undefined;
    shippingType: STPShippingType = undefined;
    additionalPaymentMethods: STPPaymentMethodType = undefined;
    createCardSources: boolean = undefined;
    stripeAccount: string = undefined;
}

export interface StripeBackendAPI {
    /**
     * Calls the client-implemented Stripe backend to retrieve a Customer Key
     * (ephemeral key).
     * 
     * @param apiVersion The API Version to send to the backend.
     * @returns a Promise with a response containing the ephemeral key as
     *     returned by the Stripe backend. For example, response.content.toJSON().
     */
    createCustomerKey(apiVersion: string): Promise<any>;

    /**
     * Calls the client-implemented Stripe backend to complete a charge.
     * 
     * @param stripeID The Stripe ID to send to the backend.
     * @param amount  The amount to charge, in pennies.
     * @param shippingHash A hash representing shipping info that can be sent to
     *     the Stripe backend. Looks similar to:
     *     "shipping[name]=XX&shipping[address][city]=Sacramento"
     * @returns a Promise that resolves on success and rejects on failure.
     */
    completeCharge(stripeID: string, amount: number, shippingHash: string): Promise<void>;
}

export interface StripePaymentListener {
    onPaymentDataChanged(data: StripePaymentData): void;
    onPaymentSuccess(): void;
    onError(errorCode: number, message: string): void;
    provideShippingMethods(address: StripeAddress): StripeShippingMethods;
}

export interface StripePaymentMethod {
    image: any; // TODO: UIImage marshals to ???
    label: string;
    templateImage: any;
}

export interface StripeShippingMethod {
    amount: number; // in pennies
    detail: string;
    label: string;
    identifier: string;
}

export interface StripeShippingMethods {
    /** Is shipping to the address valid? */
    isValid: boolean;
    /** If not valid, an error describing the issue with the address */
    validationError: string;
    /** The shipping methods available for the address. */
    shippingMethods: StripeShippingMethod[];
    /** The pre-selected (default) shipping method for the address. */
    selectedShippingMethod: StripeShippingMethod;
}

export interface StripeAddress {
    name: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
    email: string;
}

export interface StripePaymentData {
    isReadyToCharge: boolean;
    paymentMethod: StripePaymentMethod;
    shippingInfo: StripeShippingMethod;
}
