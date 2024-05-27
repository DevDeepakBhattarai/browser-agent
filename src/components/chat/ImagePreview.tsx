import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useInput } from "@/states/chat-input-state"
import { X } from "lucide-react"

export default function ImagePreview() {
  const { previewImages, setPreviewImages } = useInput()

  return (
    <Dialog>
      <div className="flex items-center gap-2">
        {previewImages.map((image) => (
          <div key={image.id}>
            <DialogTrigger className="relative h-16 w-16">
              <div className={`group/images relative h-full w-full`}>
                <img
                  src={image.url}
                  alt="Pasted"
                  className="absolute inset-0 rounded-md border border-primary-foreground object-cover"
                />
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    removeImage(image.id)
                  }}
                  className={`h-4.5 w-4.5 absolute right-0 top-0  hidden items-center justify-center rounded-full bg-secondary p-0.5 text-secondary-foreground hover:bg-muted active:scale-95 group-hover/images:flex`}>
                  {" "}
                  <X height={16} width={16}></X>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="flex h-[calc(100vh-8rem)] max-w-3xl items-center justify-center bg-transparent p-0">
              <div className="relative h-full w-full bg-transparent">
                <img
                  src={image.url}
                  alt="Pasted"
                  className="absolute inset-0 rounded-md border border-primary-foreground object-contain"
                />
              </div>
            </DialogContent>
          </div>
        ))}
      </div>
    </Dialog>
  )

  function removeImage(id: string) {
    setPreviewImages((prev) => {
      return [...prev.filter((image) => image.id !== id)]
    })
  }
}
