import {fetchProductDetails, ProductDetails} from '@/utils/kaspi';

interface ProductPageProps {
    params: {
        url: string;
    };
}

const ProductPage = async ({params}: ProductPageProps) => {
    const decodedUrl = decodeURIComponent(params.url);
    const productDetails: ProductDetails | null = await fetchProductDetails(decodedUrl);

    if (!productDetails) {
        return <p className="text-center text-gray-600">Product not found.</p>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-bold mb-4">{productDetails.heading}</h1>
            <p className="text-sm text-gray-500 mb-4">SKU: {productDetails.sku}</p>
            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Short Specifications:</h2>
                <ul className="list-disc pl-5">
                    {productDetails.short_specs.map((spec, index) => (
                        <li key={index} className="text-gray-800">{spec}</li>
                    ))}
                </ul>
            </div>
            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Specifications:</h2>
                {productDetails.specs.map((spec, index) => (
                    <div key={index} className="mb-4">
                        <h3 className="text-xl font-medium mb-2">{spec.header}</h3>
                        <ul className="list-disc pl-5">
                            {spec.specsList.map((item, idx) => (
                                <li key={idx} className="text-gray-800">
                                    <strong className="font-semibold">{item.term}:</strong> {item.definition}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div>
                <h2 className="text-2xl font-semibold mb-2">Description:</h2>
                <p className="text-gray-800">
                    {productDetails.description ? productDetails.description : "No Description"}
                </p>
            </div>
        </div>
    );
};

export default ProductPage;
