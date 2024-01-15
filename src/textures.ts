export class Textures {

    static getTexture(doc: Document, id:string): HTMLImageElement {
        var tex = doc.getElementById(id) as HTMLImageElement;
        if(tex == null) {
            throw new Error("Texture not found");
        }
        return tex;
    }

    static fetchTexture(url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            var img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image's URL: ${url}`));
            img.src = url;
        });
    }

}