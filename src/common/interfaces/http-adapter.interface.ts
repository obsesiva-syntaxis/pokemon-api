export interface HttpAdapterEssence {
    get<X>( url: string): Promise<X>;
}