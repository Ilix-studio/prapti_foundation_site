import React, { useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import {
  useGetCopyPhotosQuery,
  useUploadCopyPhotosMutation,
  useDeleteCopyPhotoMutation,
  useGetCopyAwardsQuery,
  useCreateCopyAwardMutation,
  useDeleteCopyAwardMutation,
  CopyPhoto,
  CopyAward,
} from "@/redux-store/services/copyResourceApi";
import { useGetCategoriesByTypeQuery } from "@/redux-store/services/categoryApi";

const CopyAwardDash: React.FC = () => {
  // Photo upload state
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoTitle, setPhotoTitle] = useState("");
  const [photoCategory, setPhotoCategory] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Award create state
  const [awardTitle, setAwardTitle] = useState("");
  const [awardDescription, setAwardDescription] = useState("");
  const [awardCategory, setAwardCategory] = useState("");
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);

  // Queries — guard against undefined responses
  const { data: photoCatsResp } = useGetCategoriesByTypeQuery("photo");
  const { data: awardCatsResp } = useGetCategoriesByTypeQuery("award");
  const { data: photosResp } = useGetCopyPhotosQuery();
  const { data: awardsResp } = useGetCopyAwardsQuery();

  // Normalize responses — your categoryApi returns either array or {data: [...]}
  const photoCats = Array.isArray(photoCatsResp)
    ? photoCatsResp
    : ((photoCatsResp as any)?.data ?? []);
  const awardCats = Array.isArray(awardCatsResp)
    ? awardCatsResp
    : ((awardCatsResp as any)?.data ?? []);

  const photos = photosResp?.data ?? [];
  const awards = awardsResp?.data ?? [];

  const [uploadPhotos, { isLoading: uploadingPhoto }] =
    useUploadCopyPhotosMutation();
  const [deletePhoto] = useDeleteCopyPhotoMutation();
  const [createAward, { isLoading: creatingAward }] =
    useCreateCopyAwardMutation();
  const [deleteAward] = useDeleteCopyAwardMutation();

  const togglePhotoSelection = (id: string) => {
    setSelectedPhotoIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const handleUploadPhoto = async () => {
    if (photoFiles.length === 0) {
      toast.error("Pick a file", { id: "no-file" });
      return;
    }
    if (!photoTitle.trim()) {
      toast.error("Title required", { id: "no-title" });
      return;
    }
    if (!photoCategory) {
      toast.error("Photo category required", { id: "no-cat" });
      return;
    }

    const fd = new FormData();
    photoFiles.forEach((f) => fd.append("photos", f));
    fd.append("title", photoTitle.trim());
    fd.append("category", photoCategory);

    try {
      await uploadPhotos(fd).unwrap();
      toast.success("Photo uploaded");
      setPhotoFiles([]);
      setPhotoTitle("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (e: any) {
      toast.error(e?.data?.message || "Upload failed");
    }
  };
  const handleDeletePhoto = async (id: string) => {
    if (!window.confirm("Delete photo?")) return;
    try {
      await deletePhoto(id).unwrap();
      toast.success("Photo deleted");
    } catch (e: any) {
      toast.error(e?.data?.message || "Delete failed");
    }
  };

  const handleCreateAward = async () => {
    if (!awardTitle.trim() || !awardDescription.trim() || !awardCategory) {
      toast.error("Fill all award fields");
      return;
    }
    try {
      await createAward({
        title: awardTitle.trim(),
        description: awardDescription.trim(),
        category: awardCategory,
        photos: selectedPhotoIds,
        videos: [],
      }).unwrap();
      toast.success("Award created");
      setAwardTitle("");
      setAwardDescription("");
      setSelectedPhotoIds([]);
    } catch (e: any) {
      toast.error(e?.data?.message || "Create failed");
    }
  };

  const handleDeleteAward = async (id: string) => {
    if (!window.confirm("Delete award?")) return;
    try {
      await deleteAward(id).unwrap();
      toast.success("Award deleted");
    } catch (e: any) {
      toast.error(e?.data?.message || "Delete failed");
    }
  };

  const referencedPhotoIds = useMemo(() => {
    const set = new Set<string>();
    awards.forEach((a) =>
      (a.photos as any[]).forEach((p) =>
        set.add(typeof p === "string" ? p : p._id),
      ),
    );
    return set;
  }, [awards]);

  return (
    <div className='p-6 space-y-8 max-w-6xl mx-auto'>
      <h1 className='text-2xl font-bold'>CopyAward Dashboard (test)</h1>

      {/* 1. Upload Photo */}
      <section className='border rounded-lg p-4 space-y-3'>
        <h2 className='text-lg font-semibold'>1. Upload Photo</h2>

        {photoCats.length === 0 && (
          <div className='text-sm text-amber-700 bg-amber-50 p-2 rounded'>
            No photo categories found. Create one in the Category Manager (type:{" "}
            <code>photo</code>) first.
          </div>
        )}

        {/* Hidden file input — triggered by button below */}
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          multiple
          className='hidden'
          onChange={(e) => {
            if (!e.target.files) return;
            const arr = Array.from(e.target.files);
            console.log("[file change]", arr);
            setPhotoFiles(arr);
          }}
        />

        {/* Click target */}
        <button
          type='button'
          onClick={() => fileInputRef.current?.click()}
          className='inline-flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-orange-600 transition-colors'
        >
          Choose Files
        </button>

        {photoFiles.length > 0 && (
          <div className='space-y-2'>
            <div className='text-xs text-green-700'>
              {photoFiles.length} file(s) selected
            </div>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
              {photoFiles.map((f, i) => (
                <div
                  key={i}
                  className='relative bg-gray-50 rounded overflow-hidden'
                >
                  <img
                    src={URL.createObjectURL(f)}
                    alt={f.name}
                    className='w-full h-24 object-cover'
                  />
                  <div className='text-xs p-1 truncate'>{f.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <input
          className='border px-2 py-1 w-full rounded'
          placeholder='Photo title'
          value={photoTitle}
          onChange={(e) => setPhotoTitle(e.target.value)}
        />

        <select
          className='border px-2 py-1 w-full rounded'
          value={photoCategory}
          onChange={(e) => setPhotoCategory(e.target.value)}
        >
          <option value=''>Select photo category</option>
          {photoCats.map((c: any) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <button
          type='button'
          disabled={uploadingPhoto || photoCats.length === 0}
          onClick={handleUploadPhoto}
          className='bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50'
        >
          {uploadingPhoto ? "Uploading..." : "Upload"}
        </button>
      </section>

      {/* 2. Photos */}
      <section className='border rounded-lg p-4'>
        <h2 className='text-lg font-semibold mb-3'>
          2. Photos ({photos.length}) — click to select for award
        </h2>
        {photos.length === 0 ? (
          <p className='text-sm text-gray-500'>
            No photos yet. Upload one above.
          </p>
        ) : (
          <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
            {photos.map((p: CopyPhoto) => {
              const selected = selectedPhotoIds.includes(p._id);
              const referenced = referencedPhotoIds.has(p._id);
              return (
                <div
                  key={p._id}
                  onClick={() => togglePhotoSelection(p._id)}
                  className={`border-2 rounded p-2 cursor-pointer transition ${
                    selected ? "border-blue-500" : "border-gray-200"
                  }`}
                >
                  <img
                    src={p.images[0]?.src}
                    alt={p.images[0]?.alt}
                    className='w-full h-32 object-cover rounded'
                  />
                  <div className='text-sm mt-1 font-medium truncate'>
                    {p.title}
                  </div>
                  <div className='flex justify-between items-center mt-1'>
                    {referenced && (
                      <span className='text-xs bg-amber-100 text-amber-800 px-1 rounded'>
                        in use
                      </span>
                    )}
                    <button
                      type='button'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePhoto(p._id);
                      }}
                      className='text-xs text-red-600 ml-auto'
                    >
                      delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. Create Award */}
      <section className='border rounded-lg p-4 space-y-3'>
        <h2 className='text-lg font-semibold'>
          3. Create Award ({selectedPhotoIds.length} photos selected)
        </h2>

        {awardCats.length === 0 && (
          <div className='text-sm text-amber-700 bg-amber-50 p-2 rounded'>
            No award categories found. Create one in the Category Manager (type:{" "}
            <code>award</code>) first.
          </div>
        )}

        <input
          className='border px-2 py-1 w-full rounded'
          placeholder='Award title'
          value={awardTitle}
          onChange={(e) => setAwardTitle(e.target.value)}
        />
        <textarea
          className='border px-2 py-1 w-full rounded'
          placeholder='Award description'
          value={awardDescription}
          onChange={(e) => setAwardDescription(e.target.value)}
        />
        <select
          className='border px-2 py-1 w-full rounded'
          value={awardCategory}
          onChange={(e) => setAwardCategory(e.target.value)}
        >
          <option value=''>Select award category</option>
          {awardCats.map((c: any) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          type='button'
          disabled={
            creatingAward ||
            selectedPhotoIds.length === 0 ||
            awardCats.length === 0
          }
          onClick={handleCreateAward}
          className='bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50'
        >
          {creatingAward ? "Creating..." : "Create Award"}
        </button>
      </section>

      {/* 4. Awards */}
      <section className='border rounded-lg p-4'>
        <h2 className='text-lg font-semibold mb-3'>
          4. Awards ({awards.length})
        </h2>
        {awards.length === 0 ? (
          <p className='text-sm text-gray-500'>No awards yet.</p>
        ) : (
          <div className='space-y-3'>
            {awards.map((a: CopyAward) => (
              <div key={a._id} className='border rounded p-3'>
                <div className='flex justify-between items-start'>
                  <div>
                    <div className='font-semibold'>{a.title}</div>
                    <div className='text-sm text-gray-600'>{a.description}</div>
                    <div className='text-xs text-gray-500 mt-1'>
                      {(a.photos as any[]).length} photos ·{" "}
                      {(a.videos as any[]).length} videos
                    </div>
                  </div>
                  <button
                    type='button'
                    onClick={() => handleDeleteAward(a._id)}
                    className='text-red-600 text-sm'
                  >
                    delete
                  </button>
                </div>
                <div className='flex gap-2 mt-2 flex-wrap'>
                  {(a.photos as CopyPhoto[]).map((p) =>
                    typeof p === "object" && p?.images?.[0] ? (
                      <img
                        key={p._id}
                        src={p.images[0].src}
                        alt={p.images[0].alt}
                        className='w-16 h-16 object-cover rounded'
                      />
                    ) : null,
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CopyAwardDash;
