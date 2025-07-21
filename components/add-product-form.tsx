"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/hooks/trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddProductForm({
  productToEdit,
  clearEdit,
}: {
  productToEdit?: any;
  clearEdit?: () => void;
}) {
  const [form, setForm] = useState<{
    name: string;
    description: string;
    price: string;
    stock: number;
    categoryId: string;
    image: string | File;
    slug: string;
  }>({
    name: "",
    description: "",
    price: "",
    stock: 0,
    categoryId: "",
    image: "",
    slug: "",
  });

  const [newCategory, setNewCategory] = useState("");
  const utils = trpc.useUtils();
  

  const { data: categories } = trpc.category.getAll.useQuery();



  const [previewImage, setPreviewImage] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (productToEdit) {
      setForm({
        name: productToEdit.name,
        description: productToEdit.description,
        price: productToEdit.price.toString(),
        stock: productToEdit.stock,
        categoryId: productToEdit.categoryId,
        image: productToEdit.image,
        slug: productToEdit.slug,
      });
      setPreviewImage(productToEdit.image);
    }
  }, [productToEdit]);

  const updateProduct = trpc.product.update.useMutation({
    onSuccess: () => {
      toast.success("Produk berhasil diperbarui");
      clearEdit?.();
      utils.product.getAll.invalidate();
    },
    onError: () => toast.error("Gagal memperbarui produk"),
  });

  const deleteCategory = trpc.category.delete.useMutation({
    onSuccess: () => {
      toast.success("Kategori berhasil dihapus");
      utils.category.getAll.invalidate();
      setNewCategory("");
    },
    onError: () => toast.error("Gagal hapus kategori"),
  });

  const createCategory = trpc.category.create.useMutation({
    onSuccess: () => {
      toast.success("Kategori berhasil ditambahkan");
      utils.category.getAll.invalidate();
      setNewCategory("");
    },
    onError: () => toast.error("Gagal menambahkan kategori"),
  });

  const createProduct = trpc.product.create.useMutation({
    onSuccess: () => {
      toast.success("Produk berhasil ditambahkan");
      setForm({
        name: "",
        description: "",
        price: "",
        stock: 0,
        categoryId: "",
        image: "",
        slug: "",
      });
      utils.product.getAll.invalidate();
    },
    onError: () => toast.error("Gagal menambahkan produk"),
  });

  const deleteProduct = trpc.product.delete.useMutation({
    onSuccess: () => {
      toast.success("Produk berhasil dihapus");
      utils.product.getAll.invalidate();
      clearEdit?.();
    },
    onError: () => {
      toast.error("Gagal menghapus produk");
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Apakah kamu yakin ingin menghapus produk ini?")) {
      deleteProduct.mutate(id);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.categoryId) return toast.error("Kategori wajib dipilih");

    let imageUrl = "";

    if (form.image instanceof File) {
      const formData = new FormData();
      formData.append("file", form.image);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      imageUrl = data.secure_url;
    } else if (typeof form.image === "string") {
      imageUrl = form.image;
    }

    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, "-");

    if (productToEdit) {
      updateProduct.mutate({
        id: productToEdit.id,
        name: form.name,
        description: form.description,
        price: Number(form.price),
        image: imageUrl,
        categoryId: form.categoryId,
      });
    } else {
      createProduct.mutate({
        ...form,
        price: Number(form.price),
        slug,
        image: imageUrl,
      });
    }

    setForm({
      name: "",
      description: "",
      price: "",
      stock: 0,
      categoryId: "",
      image: "",
      slug: "",
    });
    setPreviewImage(undefined);
    clearEdit?.();
  };

  return (
    <div className="max-w-lg mx-auto p-6 border rounded-lg shadow sm:w-full lg:w-[40%] ">
      <h2 className="text-xl font-bold mb-4">Tambah Produk</h2>
      <form onSubmit={handleProductSubmit} className="flex flex-col gap-4">
        {previewImage && (
          <Image
            src={previewImage}
            alt="Preview"
            width={500}
            height={300}
            className="w-full max-h-[300px] rounded border object-cover"
          />
        )}

        <div>
          <Label className="mb-1">Nama Produk</Label>
          <Input
            type="text"
            className="w-full"
            value={form.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm({ ...form, name: e.target.value })
            }
          />
        </div>
        <div>
          <Label className="mb-1">Deskripsi</Label>
          <Input
            type="text"
            className="w-full"
            value={form.description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>
        <div>
          <Label className="mb-1">Harga</Label>
          <Input
            type="text"
            className="w-full"
            inputMode="numeric"
            value={form.price}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm({ ...form, price: e.target.value })
            }
          />
        </div>
        <div>
          <Label className="mb-1">Stok</Label>
          <Input
            type="number"
            className="w-full"
            value={form.stock}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm({ ...form, stock: Number(e.target.value) })
            }
          />
        </div>
        <div>
          <div>
            <Label className="mb-1">Gambar</Label>
            <Input
              type="file"
              className="w-full"
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setForm({ ...form, image: file });
                setPreviewImage(URL.createObjectURL(file));
              }}
            />
          </div>
        </div>
        <div>
          <Label className="mb-1">Kategori</Label>
          <Select
            value={form.categoryId}
            onValueChange={(value: any) =>
              setForm({ ...form, categoryId: value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Kategori" />
            </SelectTrigger>
            <SelectContent className="w-full">
              {categories?.map((cat) => (
                <SelectItem className="w-full" key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {productToEdit ? (
          <Button
            type="submit"
            className="w-full rounded-none"
            variant="default"
            size="default"
          >
            Update Product
          </Button>
        ) : (
          <Button
            type="submit"
            className="w-full rounded-none"
            variant="default"
            size="default"
          >
            Add Product
          </Button>
        )}
        {productToEdit && (
          <div>
            <Button
              type="button"
              variant="vancy"
              onClick={clearEdit}
              className="w-full hover:bg-red-600 rounded-none"
              size="default"
            >
              Batal Edit
            </Button>
            <Button
              type="button"
              variant="vancy"
              onClick={() => handleDelete(productToEdit.id)}
              className="w-full hover:bg-red-600 rounded-none"
              size="default"
            >
              Delete
            </Button>
          </div>
        )}
      </form>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Tambah Kategori Baru</h3>
        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (newCategory.trim()) {
              const slug = newCategory.toLowerCase().replace(/\s+/g, "-");
              createCategory.mutate({ name: newCategory, slug });
            }
          }}
          className="flex gap-2"
        >
          <Input
            type="text"
            className="w-full"
            value={newCategory}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewCategory(e.target.value)
            }
            placeholder="Nama Kategori"
          />
          <Button
            type="submit"
            className="w-fit"
            variant="default"
            size="default"
          >
            Tambah
          </Button>

        </form>
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Daftar Kategori</h3>
          <ul className="flex flex-col gap-2">
            {categories?.map((cat) => (
              <li key={cat.id} className=" w-full flex justify-between items-center border p-2">
                <span>{cat.name}</span>
                <Button
                  type="button"
                  className=""
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (confirm(`Hapus kategori "${cat.name}"?`)) {
                      deleteCategory.mutate(cat.id);
                    }
                  }}
                >
                  Hapus
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
