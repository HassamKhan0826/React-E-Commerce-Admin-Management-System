import { memo, useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import SearchBar from "../../components/SearchBar";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import {
  createPlaceholderImage,
  formatCurrency,
  isPlaceholderImage,
  resizeImage,
} from "../../utils/helpers";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const emptyForm = { title: "", category: "", price: "", stock: "", description: "", image: "" };

const inputClass =
  "mt-1.5 w-full rounded-lg border border-stone-300 bg-cream-50 px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10";

function validateProduct(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = "Title is required.";
  if (!form.category.trim()) errors.category = "Category is required.";
  if (form.price === "" || Number(form.price) <= 0) errors.price = "Enter a price above 0.";
  if (form.stock === "" || Number(form.stock) < 0 || !Number.isInteger(Number(form.stock))) {
    errors.stock = "Enter a whole number (0 or more).";
  }
  return errors;
}

const ProductRow = memo(function ProductRow({ product, onView, onEdit, onDelete }) {
  return (
    <tr className="border-t border-stone-200">
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          <img
            src={product.thumbnail || createPlaceholderImage(product.title)}
            alt={product.title}
            loading="lazy"
            className="h-11 w-11 shrink-0 rounded-lg bg-cream-200 object-contain p-1"
          />
          <span className="font-medium text-stone-900">{product.title}</span>
        </div>
      </td>
      <td className="px-5 py-3 capitalize text-stone-500">{product.category.replace(/-/g, " ")}</td>
      <td className="px-5 py-3 font-medium text-stone-900">{formatCurrency(product.price)}</td>
      <td className="px-5 py-3 text-stone-700">{product.stock}</td>
      <td className="px-5 py-3 text-stone-700">
        <span className="text-gold-500">★</span> {Number(product.rating || 0).toFixed(1)}
      </td>
      <td className="px-5 py-3">
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => onView(product)}>View</Button>
          <Button variant="secondary" size="sm" onClick={() => onEdit(product)}>Edit</Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(product.id)}>Delete</Button>
        </div>
      </td>
    </tr>
  );
});

function ProductsManagement() {
  const { products, apiProducts, savedProducts, setSavedProducts, loading, error, refetch } = useProducts();

  const [search, setSearch] = useState("");
  const [modal, setModal] = useState({ type: null, product: null });
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [imageError, setImageError] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  const filteredProducts = useMemo(() => {
    const term = search.toLowerCase().trim();
    return products.filter(
      (product) =>
        !term ||
        product.title.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term),
    );
  }, [products, search]);

  const deleteProduct = useCallback(
    (id) => {
      if (!window.confirm("Delete this product?")) return;
      setSavedProducts((current) => (current ?? apiProducts).filter((product) => product.id !== id));
    },
    [apiProducts, setSavedProducts],
  );

  const openView = useCallback((product) => {
    setModal({ type: "view", product });
  }, []);

  const openEdit = useCallback((product) => {
    setModal({ type: "edit", product });
    setForm({
      title: product.title,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      description: product.description || "",
      image: isPlaceholderImage(product.thumbnail) ? "" : product.thumbnail || "",
    });
    setFormErrors({});
    setImageError("");
  }, []);

  const openAdd = () => {
    setModal({ type: "add", product: null });
    setForm(emptyForm);
    setFormErrors({});
    setImageError("");
  };

  const closeModal = useCallback(() => {
    setModal({ type: null, product: null });
  }, []);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFormErrors((current) => ({ ...current, [name]: "" }));
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Please choose an image file (JPG, PNG or WebP).");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setImageError("The image must be smaller than 5 MB.");
      return;
    }

    setImageLoading(true);
    try {
      const image = await resizeImage(file);
      setForm((current) => ({ ...current, image }));
      setImageError("");
    } catch {
      setImageError("This image couldn't be read. Please try another one.");
    } finally {
      setImageLoading(false);
    }
  };

  const removeImage = () => {
    setForm((current) => ({ ...current, image: "" }));
  };

  const handleSave = (event) => {
    event.preventDefault();

    const errors = validateProduct(form);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const title = form.title.trim();
    const values = {
      title,
      category: form.category.trim().toLowerCase(),
      price: Number(form.price),
      stock: Number(form.stock),
      description: form.description.trim(),
      thumbnail: form.image || createPlaceholderImage(title),
    };

    if (modal.type === "edit") {
      setSavedProducts((current) =>
        (current ?? apiProducts).map((product) => {
          if (product.id !== modal.product.id) return product;
          const imageUnchanged = form.image && form.image === product.thumbnail;
          return {
            ...product,
            ...values,
            images: imageUnchanged ? product.images : form.image ? [form.image] : [],
          };
        }),
      );
    } else {
      const newProduct = {
        id: Date.now(),
        rating: 0,
        discountPercentage: 0,
        brand: "",
        images: form.image ? [form.image] : [],
        ...values,
      };
      setSavedProducts((current) => [newProduct, ...(current ?? apiProducts)]);
    }

    closeModal();
  };

  const resetProducts = () => {
    if (window.confirm("Remove all local changes and reload products from the API?")) {
      setSavedProducts(null);
    }
  };

  if (loading) {
    return <Loading text="Loading products..." />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load products." onRetry={refetch} />;
  }

  const viewed = modal.type === "view" ? modal.product : null;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Products management</h1>
          <p className="mt-1 text-sm text-stone-500">
            {products.length} products · changes appear in the store
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="w-full sm:w-72">
            <SearchBar value={search} onChange={setSearch} label="Search products" placeholder="Search products..." />
          </div>
          <Button onClick={openAdd}>+ Add product</Button>
          {savedProducts && (
            <Button variant="secondary" onClick={resetProducts}>Reset</Button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-stone-200 bg-cream-50">
        <div className="overflow-x-auto">
          <table className="w-full min-w-200 text-left text-sm">
            <thead className="bg-cream-100 text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium">Rating</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onView={openView}
                  onEdit={openEdit}
                  onDelete={deleteProduct}
                />
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <p className="p-10 text-center text-sm text-stone-500">No products found.</p>
        )}
      </div>

      <Modal open={modal.type === "view"} onClose={closeModal} title="Product details">
        {viewed && (
          <div>
            <img
              src={viewed.thumbnail || createPlaceholderImage(viewed.title)}
              alt={viewed.title}
              className="mb-5 aspect-video w-full rounded-xl bg-cream-200 object-contain p-4"
            />
            <h3 className="text-xl font-semibold text-stone-900">{viewed.title}</h3>
            {viewed.description && (
              <p className="mt-2 text-sm leading-6 text-stone-600">{viewed.description}</p>
            )}
            <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-stone-500">Category</dt>
                <dd className="font-medium capitalize text-stone-900">{viewed.category.replace(/-/g, " ")}</dd>
              </div>
              <div>
                <dt className="text-stone-500">Brand</dt>
                <dd className="font-medium text-stone-900">{viewed.brand || "—"}</dd>
              </div>
              <div>
                <dt className="text-stone-500">Price</dt>
                <dd className="font-medium text-stone-900">{formatCurrency(viewed.price)}</dd>
              </div>
              <div>
                <dt className="text-stone-500">Stock</dt>
                <dd className="font-medium text-stone-900">{viewed.stock}</dd>
              </div>
            </dl>
            <Link
              to={`/products/${viewed.id}`}
              className="mt-6 inline-block text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Open in store →
            </Link>
          </div>
        )}
      </Modal>

      <Modal
        open={modal.type === "edit" || modal.type === "add"}
        onClose={closeModal}
        title={modal.type === "edit" ? "Edit product" : "Add product"}
      >
        <form onSubmit={handleSave} noValidate className="grid gap-4">
          <div>
            <p className="text-sm font-medium text-stone-700">
              Image <span className="font-normal text-stone-500">(optional)</span>
            </p>
            <div className="mt-1.5 flex items-center gap-4">
              <img
                src={form.image || createPlaceholderImage(form.title)}
                alt=""
                className="h-20 w-20 shrink-0 rounded-lg border border-stone-200 bg-cream-200 object-contain p-1"
              />
              <div className="flex flex-wrap gap-2">
                <label className="cursor-pointer rounded-lg border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-cream-100">
                  {imageLoading ? "Processing..." : form.image ? "Change image" : "Upload image"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                    disabled={imageLoading}
                  />
                </label>
                {form.image && (
                  <Button variant="danger" size="sm" onClick={removeImage}>Remove</Button>
                )}
              </div>
            </div>
            <p className="mt-1.5 text-xs text-stone-500">JPG, PNG or WebP, up to 5 MB. Without an image, initials are shown.</p>
            {imageError && <p className="mt-1 text-xs text-red-600">{imageError}</p>}
          </div>

          <div>
            <label htmlFor="product-title" className="text-sm font-medium text-stone-700">Title</label>
            <input id="product-title" name="title" value={form.title} onChange={handleFormChange} className={inputClass} />
            {formErrors.title && <p className="mt-1 text-xs text-red-600">{formErrors.title}</p>}
          </div>

          <div>
            <label htmlFor="product-category" className="text-sm font-medium text-stone-700">Category</label>
            <input id="product-category" name="category" value={form.category} onChange={handleFormChange} className={inputClass} placeholder="e.g. beauty" />
            {formErrors.category && <p className="mt-1 text-xs text-red-600">{formErrors.category}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="product-price" className="text-sm font-medium text-stone-700">Price ($)</label>
              <input id="product-price" name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleFormChange} className={inputClass} />
              {formErrors.price && <p className="mt-1 text-xs text-red-600">{formErrors.price}</p>}
            </div>
            <div>
              <label htmlFor="product-stock" className="text-sm font-medium text-stone-700">Stock</label>
              <input id="product-stock" name="stock" type="number" min="0" step="1" value={form.stock} onChange={handleFormChange} className={inputClass} />
              {formErrors.stock && <p className="mt-1 text-xs text-red-600">{formErrors.stock}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="product-description" className="text-sm font-medium text-stone-700">
              Description <span className="font-normal text-stone-500">(optional)</span>
            </label>
            <textarea
              id="product-description"
              name="description"
              rows="3"
              value={form.description}
              onChange={handleFormChange}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit" disabled={imageLoading}>
              {modal.type === "edit" ? "Save changes" : "Add product"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ProductsManagement;