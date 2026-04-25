"use server";

export async function searchUnsplash(query: string) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  
  if (!accessKey) {
    return { success: false, message: "Unsplash Access Key belum dikonfigurasi." };
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query + " wedding"
      )}&per_page=12&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
      }
    );

    const data = await response.json();
    
    return { 
      success: true, 
      images: data.results.map((img: any) => ({
        id: img.id,
        url: img.urls.regular,
        thumb: img.urls.small,
        user: img.user.name,
        link: img.links.html
      }))
    };
  } catch (error) {
    console.error("Unsplash Search Error:", error);
    return { success: false, message: "Gagal mengambil foto dari Unsplash." };
  }
}
