import { getPayload } from "payload";
import config from "../src/payload.config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function seed() {
  console.log("🌱 Starting Prime Vessels Database Seeding...");
  const payload = await getPayload({ config });

  // 1. Seed Admin User
  const existingUsers = await payload.find({
    collection: "users",
    where: {
      email: {
        equals: "admin@primevessels.com",
      },
    },
  });

  if (existingUsers.totalDocs === 0) {
    console.log("👤 Creating default admin user (admin@primevessels.com)...");
    await payload.create({
      collection: "users",
      data: {
        email: "admin@primevessels.com",
        password: "PrimeVessels@2025",
        name: "Prime Vessels Administrator",
        role: "admin",
      },
    });
    console.log("✅ Admin user created.");
  } else {
    console.log("ℹ️ Admin user already exists.");
  }

  // 2. Seed Media items
  console.log("🖼️ Seeding Media items...");
  const mediaMap: Record<string, any> = {};

  const sampleImages = [
    { name: "banner-1.png", alt: "Royal Dining Collection Hero Banner" },
    { name: "banner-2.png", alt: "Artisan Ceramic & Tableware Banner" },
    { name: "banner-3.png", alt: "Bespoke Cutlery Showcase Banner" },
    { name: "banner-4.png", alt: "Showroom Experience Banner" },
    { name: "banner-5.png", alt: "Catalogue Top Banner" },
    { name: "banner-6.png", alt: "All Categories Hero Banner" },
    { name: "banner-7.png", alt: "About Prime Vessels Top Banner" },
    { name: "banner-8.png", alt: "Contact & Showroom Top Banner" },
    { name: "banner-9.png", alt: "Hospitality & Banquet Delivery Banner" },
    { name: "product-2.png", alt: "Royal Bone China 24-Piece Dinner Set" },
    { name: "product-3.png", alt: "Imperial Gold-Plated 30-Piece Cutlery Set" },
    { name: "product-4.png", alt: "Nordic Matte Black Ceramic Serving Platter" },
    { name: "product-5.png", alt: "Handcrafted Stoneware Soup Bowl Set" },
    { name: "product-6.png", alt: "Crystal Cut Highball Glass Set" },
    { name: "product-7.png", alt: "Vintage Brass Tabletop Tea Set" },
    { name: "product-8.png", alt: "Embossed Porcelain Dessert Plates" },
    { name: "product-9.png", alt: "Artisanal Terracotta Pitcher Set" },
    { name: "product-10.png", alt: "Modern Matte Black Steak Knife Set" },
    { name: "product-11.png", alt: "Executive Tiered Afternoon Tea Stand" },
    { name: "product-12.png", alt: "Aurora Pearl-Glazed Dinner Plate Set" },
    { name: "product-13.png", alt: "Monarch Rose Gold Cutlery Set" },
    { name: "product-14.png", alt: "Florentine Crystal Wine Goblet Set" },
    { name: "product-15.png", alt: "Zenith Artisanal Stoneware Pasta Bowls" },
    { name: "product-16.png", alt: "Royal Heritage Porcelain Teapot & Cup Set" },
    { name: "product-17.png", alt: "Velvet Matte Slate Complete Dinner Service" },
    { name: "product-18.png", alt: "Solaris Mirror-Finish Champagne Spoons" },
    { name: "product-19.png", alt: "Bohemian Faceted Whiskey Tumbler Set" },
    { name: "product-20.png", alt: "Terracotta Ribbed Salad & Fruit Serving Bowl" },
    { name: "product-21.png", alt: "Art Deco Brass Hammered Coffee Carafe & Mugs" },
    { name: "product-22.png", alt: "Opulent Gold-Rimmed Charger Plates" },
    { name: "product-23.png", alt: "Phantom Black Matte Dessert Fork Set" },
    { name: "product-24.png", alt: "Sapphire-Tinted Crystal Water Chalice Set" },
    { name: "product-25.png", alt: "Emerald Reactive Glaze Oval Presentation Platter" },
    { name: "product-26.png", alt: "Regency Double-Walled Insulated Tea Tureen" },
    { name: "product-27.png", alt: "Celestial Bone China Breakfast Coupe Set" },
    { name: "product-28.png", alt: "Palace Collection Filigree Butter Knives" },
    { name: "product-29.png", alt: "Vintage Amber Crystal Decanter & Glass Ensemble" },
    { name: "product-30.png", alt: "Granite-Textured Tapas & Mezze Sharing Bowls" },
    { name: "product-31.png", alt: "Victorian Silver-Inlaid Tea Infuser & Strainer Set" },
    { name: "product-32.png", alt: "Lumiere Translucent Porcelain Soup Tureen with Ladle" },
    { name: "product-33.png", alt: "Olympia Brushed Brass Serving Tongs & Ladle Duo" },
    { name: "image1.jpg", alt: "Prime Vessels Showroom Display 1" },
    { name: "image2.jpg", alt: "Prime Vessels Showroom Display 2" },
    { name: "image3.jpg", alt: "Prime Vessels Showroom Display 3" },
    { name: "image4.jpg", alt: "Prime Vessels Showroom Display 4" },
    { name: "image5.jpg", alt: "Prime Vessels Showroom Display 5" },
    { name: "logo.png", alt: "Prime Vessels Official Logo Dark" },
    { name: "logo.png", alt: "Prime Vessels Official Logo Light" },
    { name: "logo2Black.png", alt: "Prime Vessels Logo Dark Icon" },
    { name: "logo2Yellow.png", alt: "Prime Vessels Logo Light Icon" },
    { name: "logo.png", alt: "Prime Vessels Official Logo" },
    { name: "Blog-image.jpg", alt: "Prime Vessels Blog Spotlight" },
    { name: "cartBackground.jpg", alt: "Prime Vessels Luxury Background" },
    { name: "contactbg.png", alt: "Prime Vessels Showroom Contact" },
    { name: "loginImage.jpg", alt: "Prime Vessels Experience" },
    { name: "08c2699f-3af7-4002-97ad-7af15ec0a154.jpg", alt: "Prime Vessels Favicon" },
  ];

  // Index existing media items from DB
  try {
    const allDbMedia = await payload.find({
      collection: "media",
      limit: 300,
    });

    // 1. Map by exact database filename (e.g. pv-steel.webp, banner-10.png)
    for (const m of allDbMedia.docs) {
      if (m.filename) {
        mediaMap[m.filename] = m;
      }
    }

    // 2. Map sample images by matching alt text to DB records
    for (const s of sampleImages) {
      if (!mediaMap[s.name]) {
        const matched = allDbMedia.docs.find(
          (m) => m.alt && m.alt.trim().toLowerCase() === s.alt.trim().toLowerCase()
        );
        if (matched) {
          mediaMap[s.name] = matched;
        }
      }
    }

    // 3. Fallback: match by filename base name prefix (e.g. product-2, banner-1)
    for (const s of sampleImages) {
      if (!mediaMap[s.name]) {
        const base = s.name.replace(/\.[^.]+$/, "");
        const matched = allDbMedia.docs.find(
          (m) =>
            m.filename &&
            (m.filename === s.name ||
              m.filename.startsWith(`${base}-`) ||
              m.filename.startsWith(`${base}.`))
        );
        if (matched) {
          mediaMap[s.name] = matched;
        }
      }
    }

    // 4. Also map category aliases
    const categoryAliases: Record<string, string> = {
      "product-39.png": "product-7.png",
      "product-54.png": "product-22.png",
    };
    for (const [alias, target] of Object.entries(categoryAliases)) {
      if (!mediaMap[alias] && mediaMap[target]) {
        mediaMap[alias] = mediaMap[target];
      }
    }

    console.log(`  Indexed ${allDbMedia.docs.length} existing media items from database (${Object.keys(mediaMap).length} aliases resolved).`);
  } catch (err: any) {
    console.warn("  Could not fetch existing media:", err.message);
  }

  // Only upload sample images if media collection is unseeded
  if (Object.keys(mediaMap).length < 10) {
    for (const img of sampleImages) {
      if (mediaMap[img.name]) continue;
      try {
        const existingMedia = await payload.find({
          collection: "media",
          where: {
            filename: {
              equals: img.name,
            },
          },
        });

        if (existingMedia.totalDocs > 0) {
          mediaMap[img.name] = existingMedia.docs[0];
        } else {
          const filePath = path.resolve(__dirname, "../public/media", img.name);
          if (fs.existsSync(filePath)) {
            try {
              const media = await payload.create({
                collection: "media",
                data: {
                  alt: img.alt,
                },
                filePath,
              });
              mediaMap[img.name] = media;
              console.log(`  Uploaded media: ${img.name}`);
            } catch (e: any) {
              console.warn(`  Could not upload ${img.name}:`, e.message);
            }
          }
        }
      } catch (err: any) {
        console.warn(`  Media query warning for ${img.name}:`, err.message);
      }
    }
  }

  const defaultMediaId = mediaMap["banner-1.png"]?.id || Object.values(mediaMap)[0]?.id;
  const defaultProductMediaId = mediaMap["product-2.png"]?.id || defaultMediaId;

  // 3. Seed Globals
  console.log("⚙️ Updating Globals...");
  const aboutGalleryDocs = [
    mediaMap["image1.jpg"]?.id,
    mediaMap["image2.jpg"]?.id,
    mediaMap["image3.jpg"]?.id,
    mediaMap["image4.jpg"]?.id,
    mediaMap["image5.jpg"]?.id,
  ]
    .filter(Boolean)
    .map((id) => ({ image: id }));

  const galleryGridImageDocs = [
    mediaMap["banner-4.png"]?.id,
    mediaMap["product-3.png"]?.id,
    mediaMap["product-4.png"]?.id,
  ]
    .filter(Boolean)
    .map((id) => ({ image: id }));

  await payload.updateGlobal({
    slug: "site-settings",
    data: ({
      brandName: "Prime Vessels",
      tagline: "Premium Crockery & Cutlery Showcase",
      ogImage: mediaMap["banner-1.png"]?.id || defaultMediaId,
      metaKeywords: "Prime Vessels, crockery Kerala, cutlery Ettumanoor, dinnerware sets, luxury tableware, bone china plates, porcelain dining, hotel tableware Kerala",
      address: "Pattithanam - Manarcadu Byp Rd, Ettumanoor, Kerala 686631",
      contactPhone: "080865 80402",
      contactEmail: "info@primevessels.com",
      instagramUrl: "https://www.instagram.com/prime_vessels/",
      facebookUrl: "https://www.facebook.com/primevessels",
      aboutSummary:
        "Prime Vessels is Kerala's premier destination for luxury crockery, bespoke cutlery, and elegant tableware curated for modern homes and fine hospitality.",
      showroomHours: "Monday - Saturday: 9:30am – 7:30pm",
      sundayHours: "Sunday: By Appointment",
      aboutTitle: "Hello, We are Prime Vessels.",
      aboutSubtitle: "Premium Crockery & Cutlery Showcase",
      aboutDescription1:
        "Located in Ettumanoor, Kerala, Prime Vessels is dedicated to bringing world-class tableware, porcelain dinnerware, and bespoke cutlery to discerning homeowners, luxury restaurants, and hospitality professionals.",
      aboutDescription2:
        "Every piece in our catalogue is chosen for its timeless aesthetic, tactile balance, and enduring durability — creating dining moments that linger in memory long after the meal is complete. We provide touch-and-feel showroom consultations, reliable banquet supply, and direct WhatsApp support for custom collections.",
      logoDark: mediaMap["logo.png"]?.id || defaultMediaId,
      logoLight: mediaMap["logo.png"]?.id || defaultMediaId,
      showAnnouncementBar: false,
      announcementText: "Showroom: Ettumanoor, Kottayam, Kerala",
      announcementActionText: "WhatsApp Direct",
      navLinks: [
        { label: "Home", path: "/" },
        { label: "Shop", path: "/products" },
        { label: "Collections", path: "/categories" },
        { label: "About", path: "/about" },
        { label: "Contact", path: "/contact" },
      ],
      navbarWhatsAppLabel: "WhatsApp Us",
      footerCollectionsTitle: "Curated Collections",
      footerExploreTitle: "Explore Pages",
      footerQuickLinks: [
        { label: "Home", path: "/" },
        { label: "All Products", path: "/products" },
        { label: "Categories", path: "/categories" },
        { label: "About Us", path: "/about" },
        { label: "Contact & Showroom", path: "/contact" },
      ],
      footerSocialLinks: [
        { platform: "instagram", url: "https://www.instagram.com/prime_vessels/" },
        { platform: "facebook", url: "https://www.facebook.com/primevessels" },
      ],
      aboutHeroImage: mediaMap["banner-7.png"]?.id || defaultMediaId,
      aboutDeliveryBgImage: mediaMap["banner-9.png"]?.id || defaultMediaId,
      aboutStats: [
        { number: "10+ Years", label: "Heritage in Luxury Tableware" },
        { number: "5,000+", label: "Homes & Venues Styled" },
        { number: "100%", label: "Food-Grade Bone China & Porcelain" },
        { number: "Kerala-Wide", label: "Safe Shockproof Delivery" },
      ],
      aboutDeliverySectionTitle: "Kerala-Wide & Bulk Tableware Delivery",
      aboutDeliverySectionDescription: "From curated dining sets for luxury private residences to large-scale banquet supplies for hotels and catering professionals across Kerala.",
      aboutDeliveryCtaLabel: "Enquire via WhatsApp",
      contactHeroImage: mediaMap["banner-8.png"]?.id || defaultMediaId,
      contactHeading: "Get in Touch with Our Tableware Experts",
      contactSubheading: "Whether you are curating a luxury dining set for your home or placing a bulk order for a restaurant or banquet venue, we are here to assist.",
      contactMapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3933.8824147770857!2d76.5594002!3d9.6053896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b062b9f84824d67%3A0xe54d8ef86b5daae!2sPrime%20Vessels!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      contactFormSubjects: [
        { label: "Luxury Dinnerware & Plate Sets" },
        { label: "Forged Cutlery & Flatware" },
        { label: "Hospitality / Hotel Banquet Order" },
        { label: "Catering & Event Supply" },
        { label: "Showroom Visit Appointment" },
        { label: "General Product Enquiry" },
      ],
      productsHeroImage: mediaMap["banner-5.png"]?.id || defaultMediaId,
      productsPageTitle: "Our Catalogue",
      productsPageSubtitle: "Explore our complete range of luxury crockery, bone china dinnerware, forged cutlery, and crystal glassware.",
      categoriesHeroImage: mediaMap["banner-6.png"]?.id || defaultMediaId,
      categoriesPageTitle: "All Categories",
      categoriesPageSubtitle: "Browse our crockery, cutlery, and tableware collections.",
      deliveryGuaranteeTitle: "Secure Fragile-Cargo Delivery & Replacement Guarantee",
      deliveryGuaranteeText: "All Prime Vessels shipments are packed with multi-layered shock-absorbing protection designed specifically for luxury crockery and glassware. In the unlikely event of transit damage, notify our team via WhatsApp within 48 hours for immediate replacement.",
      hospitalityCurationTitle: "Hospitality & Banquet Curation",
      hospitalityCurationText: "We offer specialized volume pricing and personalized sample inspection for hotels, catering services, banquet halls, and wedding gifting registries across Kerala.",
      aboutGallery: aboutGalleryDocs.length > 0 ? aboutGalleryDocs : undefined,
      aboutFeatures: [
        {
          title: "100% Food-Grade & Certified",
          description: "Crafted from premium translucent bone china, fine porcelain, and lead-free crystal with high-durability food-safe glazes.",
        },
        {
          title: "Forged 18/10 Stainless Steel",
          description: "Heavyweight cutlery with titanium gold and matte black PVD coatings engineered for ergonomic balance and timeless shine.",
        },
        {
          title: "Kerala-Wide & Bulk Delivery",
          description: "Comprehensive tableware supply for luxury homes, restaurants, catering, and banquet venues with secure fragile packaging.",
        },
        {
          title: "Showroom Consultation",
          description: "Visit our Ettumanoor showroom to experience the weight and finish in person, or connect via WhatsApp for curated sets.",
        },
      ],
      brandStoryHighlights: [
        {
          title: "Master Craftsmanship",
          description: "High-grade bone china, fine porcelain, and forged 18/10 stainless steel.",
        },
        {
          title: "Exclusive Designs",
          description: "Curated tableware aesthetics crafted for luxury residences and hospitality.",
        },
        {
          title: "Kerala-Wide & Bulk Delivery",
          description: "Secure packing and prompt delivery for home dining and banquet orders.",
        },
        {
          title: "Showroom Consultation",
          description: "Direct showroom support and WhatsApp consultation for custom selections.",
        },
      ],
      copyrightText: "All rights reserved.",
    } as any),
  });

  await payload.updateGlobal({
    slug: "whats-app-settings",
    data: {
      whatsappNumber: "918086580402",
      defaultMessage:
        "Hi, I am interested in Prime Vessels crockery and cutlery collections. Could you please provide more details?",
      productMessageTemplate:
        "Hi, I am interested in the {productName}. Could you please provide more details?",
      floatingButtonEnabled: true,
    },
  });

  // 4. Seed Categories (Exactly 9 items in exact order)
  console.log("📁 Seeding Categories (Exactly 9)...");

  // Map legacy slugs to updated slugs so existing product relations & records are preserved
  const legacySlugRenames: Record<string, string> = {
    "serveware-tea-sets": "brass",
    "ceramic-bowls-platters": "steel",
    "premium-cutlery": "cutlery",
    "aluminium-collection": "aluminium",
    "luxury-dinnerware": "crockery",
  };

  for (const [oldSlug, newSlug] of Object.entries(legacySlugRenames)) {
    try {
      const existingOld = await payload.find({
        collection: "categories",
        where: { slug: { equals: oldSlug } },
      });
      if (existingOld.totalDocs > 0) {
        const existingNew = await payload.find({
          collection: "categories",
          where: { slug: { equals: newSlug } },
        });
        if (existingNew.totalDocs === 0) {
          await payload.update({
            collection: "categories",
            id: existingOld.docs[0].id,
            data: { slug: newSlug } as any,
          });
          console.log(`  Renamed legacy slug: ${oldSlug} -> ${newSlug}`);
        }
      }
    } catch (e: any) {
      console.warn(`  Slug rename warning (${oldSlug}):`, e.message);
    }
  }

  const categoriesData = [
    {
      name: "Brass",
      slug: "brass",
      description:
        "Handcrafted traditional brass vessels, tabletop sets, and artisanal kitchenware.",
      thumbnailImg: "product-39.png",
      altThumbnailImg: "product-7.png",
      heroImg: "banner-4.png",
      sortOrder: 1,
      featured: false,
      metaTitle: "Brass Tableware & Vessels — Prime Vessels",
      metaDescription:
        "Explore handcrafted brass vessels, traditional tea sets, and artisanal tabletop collections.",
    },
    {
      name: "Steel",
      slug: "steel",
      description:
        "Heavy-gauge stainless steel cookware, serving bowls, and durable kitchen essentials.",
      thumbnailImg: "pv-steel.webp",
      altThumbnailImg: "product-2.png",
      heroImg: "banner-1.png",
      sortOrder: 2,
      featured: false,
      metaTitle: "Stainless Steel Cookware & Vessels — Prime Vessels",
      metaDescription:
        "Durable, heavyweight stainless steel cookware and vessels for home and banquet dining.",
    },
    {
      name: "Crockery",
      slug: "crockery",
      description:
        "Fine bone china, porcelain dinner sets, banquet plates, and artisanal ceramic dinnerware.",
      thumbnailImg: "pv-crockery.webp",
      altThumbnailImg: "product-2.png",
      heroImg: "banner-5.png",
      sortOrder: 3,
      featured: false,
      metaTitle: "Crockery & Fine Dinnerware — Prime Vessels",
      metaDescription:
        "Explore premium crockery, bone china dinnerware, and porcelain plate sets from Prime Vessels.",
    },
    {
      name: "Cutlery",
      slug: "cutlery",
      description:
        "Precision-forged 18/10 stainless steel, titanium gold, and ergonomic flatware collections.",
      thumbnailImg: "pv-cutlery.webp",
      altThumbnailImg: "product-3.png",
      heroImg: "banner-2.png",
      sortOrder: 4,
      featured: false,
      metaTitle: "Precision Cutlery & Flatware — Prime Vessels",
      metaDescription:
        "Shop bespoke cutlery sets, forged flatware, and steak knives crafted for luxury dining.",
    },
    {
      name: "Aluminium",
      slug: "aluminium",
      description:
        "Commercial-grade aluminium cookware, stockpots, and durable hospitality vessels.",
      thumbnailImg: "pv-aluminum.webp",
      altThumbnailImg: "pv-aluminum-1.webp",
      heroImg: "banner-3.png",
      sortOrder: 5,
      featured: false,
      metaTitle: "Aluminium Cookware & Sets — Prime Vessels",
      metaDescription:
        "Premium aluminium cookware and vessels designed for durability and professional kitchens.",
    },
    {
      name: "Kitchen Appliances",
      slug: "kitchen-appliances",
      description:
        "Modern countertop culinary appliances, blenders, and commercial kitchen machines.",
      thumbnailImg: "product-34.webp",
      altThumbnailImg: "product-4.png",
      heroImg: "banner-6.png",
      sortOrder: 6,
      featured: false,
      metaTitle: "Kitchen Appliances — Prime Vessels",
      metaDescription:
        "Discover essential kitchen appliances and food preparation equipment by Prime Vessels.",
    },
    {
      name: "Home Decor",
      slug: "home-decor",
      description:
        "Artisanal tabletop accents, decorative brass figurines, and curated interior centerpieces.",
      thumbnailImg: "product-54.png",
      altThumbnailImg: "product-5.png",
      heroImg: "banner-7.png",
      sortOrder: 7,
      featured: false,
      metaTitle: "Home Decor & Tabletop Accents — Prime Vessels",
      metaDescription:
        "Elevate your living spaces with handcrafted tabletop accents and luxury home decor.",
    },
    {
      name: "Gifts",
      slug: "gifts",
      description:
        "Curated luxury tableware gift boxes, banquet hampers, and bespoke wedding dining ensembles.",
      thumbnailImg: "product-34.png",
      altThumbnailImg: "product-6.png",
      heroImg: "banner-8.png",
      sortOrder: 8,
      featured: false,
      metaTitle: "Luxury Tableware Gifts & Ensembles — Prime Vessels",
      metaDescription:
        "Find exquisite tableware gifting hampers, dinnerware sets, and curated gift collections.",
    },
    {
      name: "Featured",
      slug: "featured",
      description:
        "A kitchen tells the story, the cutlery writes the details.",
      thumbnailImg: "prime-vessels-showroom.webp",
      altThumbnailImg: "banner-1.png",
      heroImg: "banner-1.png",
      sortOrder: 9,
      featured: true,
      metaTitle: "Featured Tableware Showcase — Prime Vessels",
      metaDescription:
        "A kitchen tells the story, the cutlery writes the details.",
    },
  ];

  const categoryMap: Record<string, any> = {};

  for (const cat of categoriesData) {
    const existing = await payload.find({
      collection: "categories",
      where: {
        slug: {
          equals: cat.slug,
        },
      },
    });

    const thumbId =
      mediaMap[cat.thumbnailImg]?.id ||
      mediaMap[cat.altThumbnailImg || ""]?.id ||
      defaultMediaId;
    const heroId =
      mediaMap[cat.heroImg]?.id ||
      thumbId;

    if (existing.totalDocs === 0) {
      if (thumbId) {
        const createdCat = await payload.create({
          collection: "categories",
          data: ({
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            thumbnail: thumbId,
            heroImage: heroId,
            featured: cat.featured,
            sortOrder: cat.sortOrder,
            status: "active",
            metaTitle: cat.metaTitle,
            metaDescription: cat.metaDescription,
          } as any),
        });
        categoryMap[cat.slug] = createdCat;
        console.log(`  Created category: ${cat.name} (order: ${cat.sortOrder}, featured: ${cat.featured})`);
      }
    } else {
      const updatedCat = await payload.update({
        collection: "categories",
        id: existing.docs[0].id,
        data: ({
          name: cat.name,
          description: cat.description,
          thumbnail: thumbId,
          heroImage: heroId,
          featured: cat.featured,
          sortOrder: cat.sortOrder,
          status: "active",
          metaTitle: cat.metaTitle,
          metaDescription: cat.metaDescription,
        } as any),
      });
      categoryMap[cat.slug] = updatedCat;
      console.log(`  Updated category: ${cat.name} (order: ${cat.sortOrder}, featured: ${cat.featured})`);
    }
  }

  // Delete any stale category records that are not in the 9 intended categories
  const targetSlugs = categoriesData.map((c) => c.slug);
  try {
    const allExistingCats = await payload.find({
      collection: "categories",
      limit: 100,
    });
    for (const c of allExistingCats.docs) {
      if (!targetSlugs.includes(c.slug)) {
        console.log(`  Removing stale category: ${c.name} (${c.slug})`);
        await payload.delete({
          collection: "categories",
          id: c.id,
        });
      }
    }
  } catch (e: any) {
    console.warn("  Could not cleanup stale categories:", e.message);
  }

  // Update HomepageSettings
  const spotlightCategory = categoryMap["crockery"] || Object.values(categoryMap)[0];
  if (spotlightCategory) {
    await payload.updateGlobal({
      slug: "homepage-settings",
      data: ({
        showHero: true,
        showCategories: true,
        showPromoBanner: true,
        showFeaturedProducts: true,
        showSelectedCategory: true,
        showTestimonials: true,
        showGalleryGrid: true,
        heroType: "image",
        heroMedia: mediaMap["banner-1.png"]?.id || defaultMediaId,
        heroSubtitle: "Signature Collection",
        heroTitle: "Elegance in Every Vessel",
        heroSubtext:
          "Discover our curated collection of premium crockery, cutlery, and luxury dining essentials.",
        heroCtaLabel: "Explore Collection",
        heroCtaLink: "/products",
        heroSecondaryCtaLabel: "Contact Showroom",
        heroSecondaryCtaLink: "/contact",
        categoriesSectionBadge: "Curated Collections",
        categoriesSectionTitle: "Categories",
        categoriesSectionSubtext: "Browse our crockery, cutlery, and tableware collections.",
        featuredSectionBadge: "Showroom Spotlight",
        featuredSectionTitle: "Trending Crockery & Cutlery",
        featuredSectionSubtext: "Handpicked selections from our most coveted dining collections.",
        selectedCategorySectionBadge: "Featured Category",
        selectedCategorySectionTitle: "Signature Crockery Collection",
        selectedCategorySectionSubtext: "Discover premium dining vessels crafted with timeless sophistication.",
        selectedCategorySectionCtaLabel: "Explore Collection",
        selectedCategory: spotlightCategory.id,
        testimonialsTitle: "What Our Clients Say",
        testimonialsSubtext:
          "Curated dinnerware and cutlery appreciated by leading restaurants, interior architects, and discerning hosts.",
        testimonialsRatingValue: "4.8",
        testimonialsReviewCount: "500+ reviews",
        testimonialsRatingSubtext: "From homes, hotels and restaurants across Kerala",
        galleryGridImages: galleryGridImageDocs.length > 0 ? galleryGridImageDocs : undefined,
      } as any),
    });
  }

  const createRichText = (text: string) => ({
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      children: [
        {
          type: "paragraph",
          format: "",
          indent: 0,
          version: 1,
          children: [
            {
              type: "text",
              text,
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              version: 1,
            },
          ],
        },
      ],
      direction: "ltr",
    },
  });

  // 5. Seed All 32 Products
  console.log("🍽️ Seeding All 32 Products...");
  const productsSeed = [
    {
      name: "Royal Bone China 24-Piece Dinner Set",
      slug: "royal-bone-china-24-piece-dinner-set",
      categorySlug: "luxury-dinnerware",
      description: "Crafted from premium translucent bone china with 24k gold rim detailing. Includes dinner plates, side plates, soup bowls, and serving bowls designed for 6 place settings.",
      price: 18500,
      offer: 15,
      showPrice: true,
      sku: "PV-DN-001",
      badge: "Bestseller",
      stockStatus: "in_stock" as const,
      material: "Fine Translucent Bone China with 24k Gold Detailing",
      careInstructions: "Dishwasher safe on gentle cycle. Hand wash recommended to preserve metallic gold trim.",
      specifications: [
        { label: "Set Composition", value: "6 Dinner Plates, 6 Side Plates, 6 Soup Bowls, 2 Serving Bowls, 4 Condiment Dishes" },
        { label: "Material Quality", value: "Fine Bone China (45% Bone Ash content for high translucency)" },
        { label: "Food Safety", value: "100% Food-Grade, Lead-Free & Cadmium-Free Certified" },
        { label: "Thermal Resistance", value: "Thermal shock tested up to 140°C" },
      ],
      featured: true,
      image: "product-2.png",
    },
    {
      name: "Imperial Gold-Plated 30-Piece Cutlery Set",
      slug: "imperial-gold-plated-30-piece-cutlery-set",
      categorySlug: "premium-cutlery",
      description: "Forged 18/10 stainless steel coated in durable titanium gold finish. Includes dinner knives, forks, dessert spoons, soup spoons, and tea spoons.",
      price: 9800,
      offer: 10,
      showPrice: true,
      sku: "PV-CT-002",
      badge: "Trending",
      stockStatus: "in_stock" as const,
      material: "Forged 18/10 Stainless Steel (Titanium Gold PVD Vacuum Plated)",
      careInstructions: "Dishwasher safe. Avoid harsh abrasive scrubbers to maintain mirror luster.",
      specifications: [
        { label: "Pieces Included", value: "6 Dinner Knives, 6 Dinner Forks, 6 Soup Spoons, 6 Dessert Spoons, 6 Tea Spoons" },
        { label: "Steel Grade", value: "Forged Heavyweight 18/10 (304) Stainless Steel" },
        { label: "Plating Technology", value: "PVD Titanium Vacuum Coating (Fade & Scratch Resistant)" },
        { label: "Weight & Balance", value: "Heavyweight ergonomic balance (Dinner Knife: 110g)" },
      ],
      featured: true,
      image: "product-3.png",
    },
    {
      name: "Nordic Matte Black Ceramic Serving Platter",
      slug: "nordic-matte-black-ceramic-serving-platter",
      categorySlug: "ceramic-bowls-platters",
      description: "Heavyweight stoneware serving platter with an organic reactive glaze finish. Microwave, oven, and dishwasher safe.",
      price: 2400,
      offer: 0,
      showPrice: true,
      sku: "PV-PL-003",
      badge: "New Arrival",
      stockStatus: "in_stock" as const,
      material: "High-Fire Artisanal Stoneware with Matte Reactive Glaze",
      careInstructions: "Microwave, oven (up to 220°C), and dishwasher safe.",
      specifications: [
        { label: "Dimensions", value: "36 cm Length x 22 cm Width x 3.5 cm Depth" },
        { label: "Material", value: "High-Fire Stoneware (Non-Porous Glaze)" },
        { label: "Microwave Compatibility", value: "100% Microwave & Oven Safe" },
      ],
      featured: true,
      image: "product-4.png",
    },
    {
      name: "Handcrafted Stoneware Soup Bowl Set (Set of 6)",
      slug: "handcrafted-stoneware-soup-bowl-set",
      categorySlug: "ceramic-bowls-platters",
      description: "Artisanal stoneware bowls with rustic speckled glaze. Ideal for ramen, gourmet soups, and pasta servings.",
      price: 3200,
      offer: 12,
      showPrice: true,
      sku: "PV-BW-004",
      stockStatus: "in_stock" as const,
      material: "Handcrafted Ceramic Stoneware",
      careInstructions: "Dishwasher and microwave safe.",
      specifications: [
        { label: "Capacity", value: "650 ml per bowl (Set of 6)" },
        { label: "Glaze Finish", value: "Scratch-resistant reactive satin glaze" },
      ],
      featured: true,
      image: "product-5.png",
    },
    {
      name: "Crystal Cut Highball Glass Set (Set of 6)",
      slug: "crystal-cut-highball-glass-set",
      categorySlug: "glassware-drinkware",
      description: "Lead-free European crystal tumblers with geometric faceted cuts that catch the light brilliantly for cocktails and iced beverages.",
      price: 4500,
      offer: 0,
      showPrice: true,
      sku: "PV-GL-005",
      badge: "Crystal Edition",
      stockStatus: "in_stock" as const,
      material: "Lead-Free European Brilliant Crystal",
      careInstructions: "Dishwasher safe on glassware cycle. Hand rinse recommended.",
      specifications: [
        { label: "Capacity & Height", value: "380 ml / 14.5 cm Height (Set of 6)" },
        { label: "Clarity Rating", value: "Ultra-Clear Lead-Free Barium Crystal" },
      ],
      featured: true,
      image: "product-6.png",
    },
    {
      name: "Vintage Brass Tabletop Tea & Kahwa Set",
      slug: "vintage-brass-tabletop-tea-set",
      categorySlug: "serveware-tea-sets",
      description: "Hand-embossed traditional brass tea kettle with 6 matching cups and an etched serving tray. A masterpiece for afternoon tea.",
      price: 12500,
      offer: 0,
      showPrice: false,
      sku: "PV-TS-006",
      badge: "Artisanal",
      stockStatus: "made_to_order" as const,
      material: "Pure Brass with Food-Grade Tin Coating (Kalai)",
      careInstructions: "Hand wash with mild tamarind/pitambari cleanser to restore shine.",
      specifications: [
        { label: "Set Components", value: "1 Embossed Kettle (1.2L), 6 Brass Cups with saucers, 1 Carved Serving Tray" },
        { label: "Lining", value: "Traditional Food-Grade Tin Lining" },
      ],
      featured: true,
      image: "product-7.png",
    },
    {
      name: "Embossed Porcelain Dessert Plates (Set of 4)",
      slug: "embossed-porcelain-dessert-plates",
      categorySlug: "luxury-dinnerware",
      description: "Delicate floral embossed patterns on high-fire porcelain. Ideal for presenting cakes, pastries, and appetizers.",
      price: 2800,
      offer: 5,
      showPrice: true,
      sku: "PV-DP-007",
      stockStatus: "in_stock" as const,
      material: "High-Fire Glazed Porcelain",
      careInstructions: "Dishwasher and microwave safe.",
      specifications: [
        { label: "Diameter", value: "20 cm (Set of 4 Plates)" },
      ],
      featured: false,
      image: "product-8.png",
    },
    {
      name: "Artisanal Terracotta Pitcher & Tumbler Set",
      slug: "artisanal-terracotta-pitcher-set",
      categorySlug: "glassware-drinkware",
      description: "Natural clay water jug paired with 4 tumblers that naturally keep drinking water cool while imparting an earthy aroma.",
      price: 1950,
      offer: 0,
      showPrice: true,
      sku: "PV-TC-008",
      stockStatus: "in_stock" as const,
      material: "100% Natural Riverbed Clay (Unglazed)",
      careInstructions: "Rinse with plain warm water without detergents.",
      specifications: [
        { label: "Capacity", value: "1.5 Liter Jug + 4 x 250ml Tumblers" },
      ],
      featured: false,
      image: "product-9.png",
    },
    {
      name: "Modern Matte Black Steak Knife Set (Set of 6)",
      slug: "modern-matte-black-steak-knife-set",
      categorySlug: "premium-cutlery",
      description: "Serrated German steel blades with ergonomic handles and non-stick black titanium coating for effortless slicing.",
      price: 3600,
      offer: 10,
      showPrice: true,
      sku: "PV-SK-009",
      badge: "Chef's Choice",
      stockStatus: "in_stock" as const,
      material: "German Stainless Steel with Black Titanium PVD",
      careInstructions: "Hand wash recommended to maintain razor-sharp serration.",
      specifications: [
        { label: "Blade Length", value: "12.5 cm Serrated Blade (Set of 6 Knives)" },
      ],
      featured: true,
      image: "product-10.png",
    },
    {
      name: "Executive Tiered Afternoon Tea Stand",
      slug: "executive-tiered-afternoon-tea-stand",
      categorySlug: "serveware-tea-sets",
      description: "3-tier ceramic and gold finish metal dessert stand for showcasing macarons, scones, cupcakes, and finger foods.",
      price: 4200,
      offer: 0,
      showPrice: false,
      sku: "PV-AS-010",
      badge: "Banquet Edition",
      stockStatus: "in_stock" as const,
      material: "Porcelain Plates with Brass Plated Stainless Steel Stand",
      careInstructions: "Plates are dishwasher safe; wipe stand with damp cloth.",
      specifications: [
        { label: "Height & Plate Sizes", value: "38 cm Total Height; 26cm, 20cm, 15cm Plate Tiers" },
      ],
      featured: false,
      image: "product-11.png",
    },
    {
      name: "Aurora Pearl-Glazed Dinner Plate Set (Set of 6)",
      slug: "aurora-pearl-glazed-dinner-plate-set",
      categorySlug: "luxury-dinnerware",
      description: "Iridescent pearlescent glaze on ultra-refined vitrified porcelain. Designed for fine dining dinner presentations.",
      price: 14200,
      offer: 10,
      showPrice: true,
      sku: "PV-DN-011",
      badge: "New Arrival",
      stockStatus: "in_stock" as const,
      material: "Vitrified Fine Porcelain with Luster Finish",
      careInstructions: "Dishwasher safe. Microwave safe.",
      specifications: [
        { label: "Plate Diameter", value: "27.5 cm (Set of 6 Dinner Plates)" },
      ],
      featured: true,
      image: "product-12.png",
    },
    {
      name: "Monarch Rose Gold Cutlery Set (24-Piece)",
      slug: "monarch-rose-gold-cutlery-set",
      categorySlug: "premium-cutlery",
      description: "24-piece heavy gauge 18/10 stainless steel flatware in satin rose gold PVD vacuum coating.",
      price: 8400,
      offer: 0,
      showPrice: true,
      sku: "PV-CT-012",
      badge: "Luxury Edition",
      stockStatus: "in_stock" as const,
      material: "Forged 18/10 Stainless Steel with Rose Gold PVD",
      careInstructions: "Dishwasher safe.",
      specifications: [
        { label: "Set Includes", value: "6 Knives, 6 Forks, 6 Spoons, 6 Teaspoons" },
      ],
      featured: true,
      image: "product-13.png",
    },
    {
      name: "Florentine Crystal Wine Goblet Set (Set of 6)",
      slug: "florentine-crystal-wine-goblet-set",
      categorySlug: "glassware-drinkware",
      description: "Hand-blown European crystal stemware with slender pulled stems and laser-cut rims for enhanced bouquet.",
      price: 5600,
      offer: 8,
      showPrice: true,
      sku: "PV-GL-013",
      badge: "Handmade",
      stockStatus: "in_stock" as const,
      material: "Lead-Free Bohemian Crystal",
      careInstructions: "Dishwasher safe on gentle glassware cycle.",
      specifications: [
        { label: "Capacity", value: "450 ml per goblet (Set of 6)" },
      ],
      featured: false,
      image: "product-14.png",
    },
    {
      name: "Zenith Artisanal Stoneware Pasta Bowls (Set of 4)",
      slug: "zenith-artisanal-stoneware-pasta-bowls",
      categorySlug: "ceramic-bowls-platters",
      description: "Deep coupe stoneware bowls with organic charcoal rim detailing. Ideal for pasta, salads, and curries.",
      price: 3800,
      offer: 0,
      showPrice: true,
      sku: "PV-BW-014",
      badge: "Chef's Choice",
      stockStatus: "in_stock" as const,
      material: "High-Fire Ceramic Stoneware",
      careInstructions: "Oven safe to 200°C, microwave and dishwasher safe.",
      specifications: [
        { label: "Capacity", value: "900 ml per bowl (Set of 4)" },
      ],
      featured: true,
      image: "product-15.png",
    },
    {
      name: "Royal Heritage Porcelain Teapot & Cup Set",
      slug: "royal-heritage-porcelain-tea-pot-set",
      categorySlug: "serveware-tea-sets",
      description: "Heritage teapot with stainless steel infuser basket, matching creamer, sugar bowl, and 6 teacups with saucers.",
      price: 9500,
      offer: 15,
      showPrice: true,
      sku: "PV-TS-015",
      badge: "Signature",
      stockStatus: "in_stock" as const,
      material: "Fine Porcelain with Platinum Trim",
      careInstructions: "Hand wash recommended.",
      specifications: [
        { label: "Teapot Capacity", value: "1.1 Liter Infuser Teapot" },
      ],
      featured: false,
      image: "product-16.png",
    },
    {
      name: "Velvet Matte Slate Complete Dinner Service (18-Piece)",
      slug: "velvet-matte-slate-dinner-service",
      categorySlug: "luxury-dinnerware",
      description: "Minimalist Scandinavian matte slate finish dinnerware set designed for modern banquet hospitality.",
      price: 16900,
      offer: 12,
      showPrice: true,
      sku: "PV-DN-016",
      badge: "Trending",
      stockStatus: "in_stock" as const,
      material: "Vitrified Porcelain with Velvet Matte Glaze",
      careInstructions: "Microwave, oven, and dishwasher safe.",
      specifications: [
        { label: "Pieces", value: "6 Dinner Plates, 6 Side Plates, 6 All-Purpose Bowls" },
      ],
      featured: true,
      image: "product-17.png",
    },
    {
      name: "Solaris Mirror-Finish Champagne Spoons (Set of 6)",
      slug: "solaris-mirror-finish-champagne-spoons",
      categorySlug: "premium-cutlery",
      description: "Extended handle cocktail and dessert spoons with mirrored champagne titanium plating.",
      price: 4200,
      offer: 0,
      showPrice: true,
      sku: "PV-CT-017",
      badge: "18/10 Steel",
      stockStatus: "in_stock" as const,
      material: "18/10 Stainless Steel with Champagne Gold Finish",
      careInstructions: "Dishwasher safe.",
      specifications: [
        { label: "Length", value: "21 cm Long-Handle Design (Set of 6)" },
      ],
      featured: false,
      image: "product-18.png",
    },
    {
      name: "Bohemian Faceted Whiskey Tumbler Set (Set of 4)",
      slug: "bohemian-faceted-whiskey-tumbler-set",
      categorySlug: "glassware-drinkware",
      description: "Heavy base crystal rocks glasses featuring deep geometric light-refracting cuts.",
      price: 4900,
      offer: 5,
      showPrice: true,
      sku: "PV-GL-018",
      badge: "Lead-Free",
      stockStatus: "in_stock" as const,
      material: "Heavy-Base European Lead-Free Crystal",
      careInstructions: "Dishwasher safe.",
      specifications: [
        { label: "Capacity", value: "320 ml / 380g Heavy Base (Set of 4)" },
      ],
      featured: true,
      image: "product-19.png",
    },
    {
      name: "Terracotta Ribbed Salad & Fruit Serving Bowl",
      slug: "terracotta-ribbed-salad-serving-bowl",
      categorySlug: "ceramic-bowls-platters",
      description: "Large hand-thrown ribbed earthenware bowl with glazed interior and natural unglazed earthy exterior.",
      price: 2600,
      offer: 0,
      showPrice: true,
      sku: "PV-BW-019",
      badge: "Artisanal",
      stockStatus: "in_stock" as const,
      material: "Natural Terracotta with White Interior Glaze",
      careInstructions: "Hand wash with mild soap.",
      specifications: [
        { label: "Diameter", value: "30 cm Diameter x 10 cm Height" },
      ],
      featured: false,
      image: "product-20.png",
    },
    {
      name: "Art Deco Brass Hammered Coffee Carafe & Mugs",
      slug: "art-deco-brass-hammered-coffee-carafe",
      categorySlug: "serveware-tea-sets",
      description: "Hand-hammered brass pour-over coffee carafe paired with 4 insulated brass serving tumblers.",
      price: 8800,
      offer: 0,
      showPrice: false,
      sku: "PV-TS-020",
      badge: "Hand-Crafted",
      stockStatus: "in_stock" as const,
      material: "Solid Brass with Food-Grade Tin Lining",
      careInstructions: "Hand wash only.",
      specifications: [
        { label: "Capacity", value: "800 ml Carafe + 4 x 180ml Tumblers" },
      ],
      featured: true,
      image: "product-21.png",
    },
    {
      name: "Opulent Gold-Rimmed Charger Plates (Set of 6)",
      slug: "opulent-gold-rimmed-chargers-set",
      categorySlug: "luxury-dinnerware",
      description: "33cm statement presentation charger plates featuring textured relief borders with gold leaf finish.",
      price: 6500,
      offer: 10,
      showPrice: true,
      sku: "PV-DN-021",
      badge: "Banquet Set",
      stockStatus: "in_stock" as const,
      material: "Heavyweight Glass Porcelain with Metallic Rim",
      careInstructions: "Wipe with damp cloth or hand rinse.",
      specifications: [
        { label: "Diameter", value: "33 cm (Set of 6 Charger Plates)" },
      ],
      featured: false,
      image: "product-22.png",
    },
    {
      name: "Phantom Black Matte Dessert Fork Set (Set of 6)",
      slug: "phantom-black-matte-dessert-forks",
      categorySlug: "premium-cutlery",
      description: "Contemporary matte black 3-prong pastry and fruit forks crafted from forged 18/10 stainless steel.",
      price: 3100,
      offer: 0,
      showPrice: true,
      sku: "PV-CT-022",
      badge: "PVD Coated",
      stockStatus: "in_stock" as const,
      material: "18/10 Stainless Steel with Black PVD Finish",
      careInstructions: "Dishwasher safe.",
      specifications: [
        { label: "Length", value: "16 cm (Set of 6 Dessert Forks)" },
      ],
      featured: false,
      image: "product-23.png",
    },
    {
      name: "Sapphire-Tinted Crystal Water Chalice Set (Set of 6)",
      slug: "sapphire-tinted-crystal-water-chalice-set",
      categorySlug: "glassware-drinkware",
      description: "Solid-colored sapphire blue crystal chalices with faceted diamond patterns that will never fade.",
      price: 5200,
      offer: 0,
      showPrice: true,
      sku: "PV-GL-023",
      badge: "Crystal",
      stockStatus: "in_stock" as const,
      material: "Solid Colored Lead-Free Crystal",
      careInstructions: "Dishwasher safe.",
      specifications: [
        { label: "Capacity", value: "350 ml (Set of 6 Chalices)" },
      ],
      featured: false,
      image: "product-24.png",
    },
    {
      name: "Emerald Reactive Glaze Oval Presentation Platter",
      slug: "emerald-reactive-glaze-oval-platter",
      categorySlug: "ceramic-bowls-platters",
      description: "Striking emerald green reactive glaze platter with gold-brown speckled rim for roast and appetizer presentation.",
      price: 3400,
      offer: 15,
      showPrice: true,
      sku: "PV-PL-024",
      badge: "Best Value",
      stockStatus: "in_stock" as const,
      material: "High-Fire Artisanal Ceramic",
      careInstructions: "Microwave and dishwasher safe.",
      specifications: [
        { label: "Dimensions", value: "38 cm Length x 24 cm Width" },
      ],
      featured: true,
      image: "product-25.png",
    },
    {
      name: "Regency Double-Walled Insulated Tea Tureen",
      slug: "regency-double-walled-insulated-tea-tureen",
      categorySlug: "serveware-tea-sets",
      description: "Double-walled thermal ceramic tureen with brass handle to keep soups, broths, and tea steaming hot.",
      price: 11200,
      offer: 0,
      showPrice: false,
      sku: "PV-TS-025",
      badge: "Executive",
      stockStatus: "made_to_order" as const,
      material: "Double-Walled Insulated Fine Ceramic with Brass Trim",
      careInstructions: "Hand wash ceramic; wipe brass hardware.",
      specifications: [
        { label: "Capacity", value: "2.2 Liters" },
      ],
      featured: false,
      image: "product-26.png",
    },
    {
      name: "Celestial Bone China Breakfast Coupe Set",
      slug: "celestial-bone-china-breakfast-coupe-set",
      categorySlug: "luxury-dinnerware",
      description: "12-piece breakfast dining set including coupe bowls, coffee mugs, and breakfast plates with delicate platinum accents.",
      price: 12800,
      offer: 10,
      showPrice: true,
      sku: "PV-DN-026",
      badge: "Bestseller",
      stockStatus: "in_stock" as const,
      material: "Fine Bone China with Platinum Rim",
      careInstructions: "Dishwasher safe on gentle cycle.",
      specifications: [
        { label: "Set Components", value: "4 Plates, 4 Coupe Bowls, 4 Coffee Mugs (320ml)" },
      ],
      featured: false,
      image: "product-27.png",
    },
    {
      name: "Palace Collection Filigree Butter Knives (Set of 4)",
      slug: "palace-collection-filigree-butter-knives",
      categorySlug: "premium-cutlery",
      description: "Solid forged butter spreaders with ornate filigree-engraved brass handles and polished steel blades.",
      price: 3900,
      offer: 0,
      showPrice: true,
      sku: "PV-CT-027",
      badge: "Vintage",
      stockStatus: "in_stock" as const,
      material: "Forged 18/10 Stainless Steel with Filigree Brass Handle",
      careInstructions: "Hand wash recommended.",
      specifications: [
        { label: "Length", value: "17 cm (Set of 4 Butter Knives)" },
      ],
      featured: false,
      image: "product-28.png",
    },
    {
      name: "Vintage Amber Crystal Decanter & Glass Ensemble",
      slug: "vintage-amber-crystal-decanter-glass-set",
      categorySlug: "glassware-drinkware",
      description: "Hand-blown warm amber crystal decanter (1.0L) paired with 6 matching faceted crystal lowball tumblers.",
      price: 7800,
      offer: 10,
      showPrice: true,
      sku: "PV-GL-028",
      badge: "Limited Edition",
      stockStatus: "in_stock" as const,
      material: "Hand-Blown Amber Tinted Crystal",
      careInstructions: "Hand rinse recommended for decanter.",
      specifications: [
        { label: "Ensemble", value: "1 Decanter (1000ml) + 6 Tumblers (280ml)" },
      ],
      featured: true,
      image: "product-29.png",
    },
    {
      name: "Granite-Textured Tapas & Mezze Sharing Bowls (Set of 3)",
      slug: "granite-textured-tapas-sharing-bowls",
      categorySlug: "ceramic-bowls-platters",
      description: "Trio of graduated textured ceramic bowls with matte granite stone finish on solid acacia wood tray.",
      price: 2900,
      offer: 0,
      showPrice: true,
      sku: "PV-BW-029",
      badge: "Stoneware",
      stockStatus: "in_stock" as const,
      material: "Granite-Texture Stoneware with Acacia Wood Base",
      careInstructions: "Bowls are dishwasher safe; oil wood tray periodically.",
      specifications: [
        { label: "Bowl Sizes", value: "16 cm, 13 cm, 10 cm + 38 cm Wood Serving Tray" },
      ],
      featured: false,
      image: "product-30.png",
    },
    {
      name: "Victorian Silver-Inlaid Tea Infuser & Strainer Set",
      slug: "victorian-silver-inlaid-tea-infuser-set",
      categorySlug: "serveware-tea-sets",
      description: "Intricately detailed tea strainer with drip bowl and matching loose-leaf infuser spoon.",
      price: 6400,
      offer: 0,
      showPrice: true,
      sku: "PV-TS-030",
      badge: "Handmade",
      stockStatus: "in_stock" as const,
      material: "Nickel-Silver Coated 18/10 Stainless Steel",
      careInstructions: "Hand wash with warm soapy water.",
      specifications: [
        { label: "Set Components", value: "1 Strainer with Stand + 1 Infuser Spoon" },
      ],
      featured: false,
      image: "product-31.png",
    },
    {
      name: "Lumiere Translucent Porcelain Soup Tureen with Ladle",
      slug: "lumiere-translucent-porcelain-soup-tureen",
      categorySlug: "luxury-dinnerware",
      description: "Classic imperial soup tureen with sculptured pedestal handles, matching cover, and porcelain serving ladle.",
      price: 8900,
      offer: 10,
      showPrice: true,
      sku: "PV-DN-031",
      badge: "Banquet",
      stockStatus: "in_stock" as const,
      material: "High-Translucency Vitrified Bone Porcelain",
      careInstructions: "Dishwasher and microwave safe.",
      specifications: [
        { label: "Capacity", value: "3.0 Liter Tureen + 28 cm Ladle" },
      ],
      featured: false,
      image: "product-32.png",
    },
    {
      name: "Olympia Brushed Brass Serving Tongs & Ladle Duo",
      slug: "olympia-brushed-brass-serving-tongs-ladle",
      categorySlug: "serveware-tea-sets",
      description: "Heavy gauge brushed satin brass salad tongs and banquet soup ladle designed for luxury buffet service.",
      price: 3700,
      offer: 0,
      showPrice: true,
      sku: "PV-TS-032",
      badge: "Hospitality",
      stockStatus: "in_stock" as const,
      material: "Forged Brass with Food-Grade Protective Coating",
      careInstructions: "Hand wash with mild detergent.",
      specifications: [
        { label: "Dimensions", value: "Tongs: 24 cm, Ladle: 28 cm" },
      ],
      featured: false,
      image: "product-33.png",
    },
  ];

  for (let i = 0; i < productsSeed.length; i++) {
    const prod = productsSeed[i];
    const existing = await payload.find({
      collection: "products",
      where: {
        slug: {
          equals: prod.slug,
        },
      },
    });

    const categorySlugMapping: Record<string, string> = {
      "luxury-dinnerware": "crockery",
      "premium-cutlery": "cutlery",
      "glassware-drinkware": "crockery",
      "ceramic-bowls-platters": "steel",
      "serveware-tea-sets": "brass",
      "aluminium-collection": "aluminium",
    };
    const mappedSlug = categorySlugMapping[prod.categorySlug] || prod.categorySlug;
    const categoryId = categoryMap[mappedSlug]?.id || categoryMap[prod.categorySlug]?.id || Object.values(categoryMap)[0]?.id;
    const imgId = mediaMap[prod.image]?.id || defaultProductMediaId;
    const secIdx = (i + 1) % productsSeed.length;
    const secImgId = mediaMap[productsSeed[secIdx].image]?.id || imgId;
    const thirdIdx = (i + 2) % productsSeed.length;
    const thirdImgId = mediaMap[productsSeed[thirdIdx].image]?.id || secImgId;

    if (existing.totalDocs === 0 && categoryId && imgId) {
      await payload.create({
        collection: "products",
        data: ({
          name: prod.name,
          slug: prod.slug,
          category: categoryId,
          description: createRichText(prod.description) as any,
          mainImage: imgId,
          gallery: [{ image: imgId }, { image: secImgId }, { image: thirdImgId }],
          price: prod.price,
          offer: prod.offer,
          showPrice: prod.showPrice,
          sku: prod.sku,
          badge: prod.badge,
          stockStatus: prod.stockStatus,
          material: prod.material,
          careInstructions: prod.careInstructions,
          specifications: prod.specifications,
          featured: prod.featured,
          status: "active",
          metaTitle: `${prod.name} — Prime Vessels`,
          metaDescription: prod.description,
        } as any),
      });
      console.log(`  Created product: ${prod.name}`);
    } else if (existing.totalDocs > 0) {
      await payload.update({
        collection: "products",
        id: existing.docs[0].id,
        data: ({
          name: prod.name,
          category: categoryId,
          description: createRichText(prod.description) as any,
          mainImage: imgId,
          gallery: [{ image: imgId }, { image: secImgId }, { image: thirdImgId }],
          price: prod.price,
          offer: prod.offer,
          showPrice: prod.showPrice,
          sku: prod.sku,
          badge: prod.badge,
          stockStatus: prod.stockStatus,
          material: prod.material,
          careInstructions: prod.careInstructions,
          specifications: prod.specifications,
          featured: prod.featured,
          status: "active",
        } as any),
      });
      console.log(`  Updated product: ${prod.name}`);
    }
  }

  // 6. Seed Banners
  console.log("🚩 Seeding Banners...");
  const bannersSeed = [
    {
      title: "Timeless Tableware Collections",
      subtitle: "Showroom Collection",
      description: "Crafted for unforgettable dining moments and elegant hospitality.",
      ctaLabel: "Browse Catalogue",
      ctaLink: "/products",
      target: "_self" as const,
      secondaryCtaLabel: "Showroom Visit",
      secondaryCtaLink: "/contact",
      displayLocation: "homepage-promo" as const,
      sortOrder: 1,
      image: "banner-1.png",
    },
    {
      title: "Artisan Ceramic & Fine Porcelain",
      subtitle: "Luxury Dining Edition",
      description: "Elevate your culinary presentation with durable luxury crockery.",
      ctaLabel: "View Categories",
      ctaLink: "/categories",
      target: "_self" as const,
      displayLocation: "homepage-promo" as const,
      sortOrder: 2,
      image: "banner-2.png",
    },
    {
      title: "Bespoke Cutlery & Serving Essentials",
      subtitle: "18/10 Titanium & Gold",
      description: "Precision engineering meets timeless Kerala hospitality.",
      ctaLabel: "Enquire on WhatsApp",
      ctaLink: "https://wa.me/918086580402",
      target: "_blank" as const,
      displayLocation: "homepage-promo" as const,
      sortOrder: 3,
      image: "banner-3.png",
    },
    {
      title: "Elevate Your Dining Experience",
      subtitle: "Showroom Collection",
      description: "Visit our Ettumanoor showroom to experience our full tableware collection.",
      ctaLabel: "Find Us",
      ctaLink: "/contact",
      target: "_self" as const,
      displayLocation: "between-sections" as const,
      sortOrder: 4,
      image: "banner-4.png",
    },
    {
      title: "Curated Hospitality & Banquet Tableware",
      subtitle: "Bulk Hotel Supply",
      description: "Custom bulk packages, banquet dinnerware curation, and Kerala-wide safe delivery.",
      ctaLabel: "Enquire on WhatsApp",
      ctaLink: "https://wa.me/918086580402",
      target: "_blank" as const,
      displayLocation: "product-pages" as const,
      sortOrder: 5,
      image: "banner-5.png",
    },
    {
      title: "Explore Our Full Range of Dining Collections",
      subtitle: "Fine Dining & Gifting",
      description: "Discover bone china, forged cutlery, and lead-free crystal glassware crafted for hospitality and homes.",
      ctaLabel: "View All Products",
      ctaLink: "/products",
      target: "_self" as const,
      displayLocation: "category-pages" as const,
      sortOrder: 6,
      image: "banner-6.png",
    },
  ];

  for (const ban of bannersSeed) {
    const existing = await payload.find({
      collection: "banners",
      where: {
        title: {
          equals: ban.title,
        },
      },
    });

    const imgId = mediaMap[ban.image]?.id || defaultMediaId;

    if (existing.totalDocs === 0 && imgId) {
      await payload.create({
        collection: "banners",
        data: {
          title: ban.title,
          subtitle: ban.subtitle,
          description: ban.description,
          ctaLabel: ban.ctaLabel,
          ctaLink: ban.ctaLink,
          target: ban.target,
          secondaryCtaLabel: ban.secondaryCtaLabel,
          secondaryCtaLink: ban.secondaryCtaLink,
          displayLocation: ban.displayLocation,
          sortOrder: ban.sortOrder,
          image: imgId,
          status: "active",
        },
      });
      console.log(`  Created banner: ${ban.title}`);
    } else if (existing.totalDocs > 0) {
      await payload.update({
        collection: "banners",
        id: existing.docs[0].id,
        data: {
          title: ban.title,
          subtitle: ban.subtitle,
          description: ban.description,
          ctaLabel: ban.ctaLabel,
          ctaLink: ban.ctaLink,
          target: ban.target,
          secondaryCtaLabel: ban.secondaryCtaLabel,
          secondaryCtaLink: ban.secondaryCtaLink,
          displayLocation: ban.displayLocation,
          sortOrder: ban.sortOrder,
          image: imgId,
          status: "active",
        },
      });
      console.log(`  Updated banner: ${ban.title}`);
    }
  }

  // 7. Seed Testimonials
  console.log("💬 Seeding Testimonials...");
  const testimonialsSeed = [
    {
      authorName: "Sarah Jenkins",
      roleOrCompany: "Interior Designer",
      content: "The quality of the bone china dinnerware is exceptional. Our clients were absolutely thrilled with the elegant presentation it brought to their dining room.",
      rating: 5,
      status: "active",
      sortOrder: 1,
    },
    {
      authorName: "Michael Chang",
      roleOrCompany: "Executive Chef, The Grand Hotel",
      content: "We've been using Prime Vessels' cutlery sets in our premium suites. They maintain their brilliant finish even after hundreds of industrial washes. Outstanding durability.",
      rating: 5,
      status: "active",
      sortOrder: 2,
    },
    {
      authorName: "Elena Rodriguez",
      content: "I purchased the crystal glassware set for my husband's anniversary gift. The craftsmanship is flawless. It feels truly luxurious in hand.",
      rating: 5,
      status: "active",
      sortOrder: 3,
    },
    {
      authorName: "David O'Connor",
      roleOrCompany: "Event Planner",
      content: "Prime Vessels is my go-to for all high-end banquets. Their serving platters add that perfect touch of sophistication to any culinary display.",
      rating: 4,
      status: "active",
      sortOrder: 4,
    }
  ];

  for (const test of testimonialsSeed) {
    const existing = await payload.find({
      collection: "testimonials",
      where: {
        authorName: {
          equals: test.authorName,
        },
      },
    });

    if (existing.totalDocs === 0) {
      await payload.create({
        collection: "testimonials",
        data: test as any,
      });
      console.log(`  Created testimonial: ${test.authorName}`);
    } else {
      await payload.update({
        collection: "testimonials",
        id: existing.docs[0].id,
        data: test as any,
      });
      console.log(`  Updated testimonial: ${test.authorName}`);
    }
  }

  // Seed Collection Grid Offers
  console.log("\n🏷️  Seeding Collection Grid Offers...");
  const anyMedia = Object.values(mediaMap)[0];
  const offersSeed = [
    {
      eyebrow: "Special Offer",
      title: "Plate 50% Off",
      description: "Hand-finished dinner plates for everyday tables and banquet service.",
      imageName: "product-2.png",
      categorySlug: "crockery",
      backgroundColor: "blush",
      position: 4,
    },
    {
      eyebrow: "This Week",
      title: "Cups 35% Off",
      description: "Stoneware cups and mugs in soft glazes, made for slow mornings.",
      imageName: "product-5.png",
      categorySlug: "gifts",
      backgroundColor: "sand",
      position: 8,
    },
  ];

  for (const offer of offersSeed) {
    const image = mediaMap[offer.imageName] || anyMedia;
    if (!image) {
      console.warn(`  Skipped offer ${offer.title}: no media available`);
      continue;
    }
    const { imageName, categorySlug, ...rest } = offer;
    const data = {
      ...rest,
      image: image.id,
      ctaLabel: "Discover",
      linkType: "category",
      linkedCategory: categoryMap[categorySlug]?.id,
      imagePosition: "right",
      displayLocation: ["homepage", "categories-page"],
      status: "active",
    };
    const existing = await payload.find({
      collection: "offers",
      where: { title: { equals: offer.title } },
    });
    if (existing.totalDocs === 0) {
      await payload.create({ collection: "offers", data: data as any });
      console.log(`  Created offer: ${offer.title}`);
    } else {
      await payload.update({ collection: "offers", id: existing.docs[0].id, data: data as any });
      console.log(`  Updated offer: ${offer.title}`);
    }
  }

  console.log("\n🎉 Database Seeding Completed Successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
