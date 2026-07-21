import slugify from "slugify";

export const generateUniqueSlug = async (

    model: any,

    name: string,

    field: string = "slug"

) => {

    const baseSlug = slugify(name, {

        lower: true,

        strict: true,

        trim: true

    });

    let slug = baseSlug;

    let counter = 1;

    while (

        await model.exists({

            [field]: slug

        })

    ) {

        slug = `${baseSlug}-${counter}`;

        counter++;

    }

    return slug;

};
