import Link from 'next/link';
import styles from './page.module.css';
import fetchProducts, {Product} from "@/utils/kaspi";

const Home = async () => {
  const products: Product[] | null = await fetchProducts();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Product List</h1>
      {products ? (
        <ul className={styles.productList}>
          {products.map((product, index) => (
            <li key={index} className={styles.productItem}>
              <h2>{product.title}</h2>
              <p>Brand: {product.brand}</p>
              <p>Price: {product.unitPrice}</p>
              <p>Rating: {product.rating}</p>
              <Link href={`/product/${encodeURIComponent(product.shopLink)}`} className={styles.shopLink}>View Details</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default Home;
