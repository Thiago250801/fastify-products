export function mapProduct(product: any) {
  return {
    ...product,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    user: product.user
      ? {
          ...product.user,
          createdAt: product.user.createdAt?.toISOString(),
        }
      : null,
  };
}