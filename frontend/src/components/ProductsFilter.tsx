
import React, { useEffect, useState } from 'react'
import { ListFilter, ListFilterPlus, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserMeta } from '@/context/userContext'

type TagType = {
  [key: string]: string[]
}

export default function FilterDialog() {
  const {userMeta} = React.useContext(UserMeta);
  const [tags, setTags] = useState<TagType>({
    feel: ["Elegant"],
    occasion: ["Workout"],
    style: ["Modern"]
  })

  useEffect(() => {
    if(userMeta?.data?.user_preference){
      let userPreference = userMeta.data.user_preference;
      setTags({
        feel: userPreference?.feel ? [userPreference?.feel] : [],
        occasion: userPreference?.occasion ? [userPreference?.occasion] : [],
        style: userPreference?.style ? [userPreference?.style] : []
      })
    }
    
  }
  , [userMeta])

  const [newTag, setNewTag] = useState('')
  const [selectedKey, setSelectedKey] = useState<string | undefined>()

  const removeTag = (key: string, tag: string) => {
    setTags(prevTags => ({
      ...prevTags,
      [key]: prevTags[key].filter(t => t !== tag)
    }))
  }

  const addTag = () => {
    if (newTag && selectedKey) {
      setTags(prevTags => ({
        ...prevTags,
        [selectedKey]: [...(prevTags[selectedKey] || []), newTag]
      }))
      setNewTag('')
      setSelectedKey(undefined)
    }
  }

  return (
    <div>
        <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
            <ListFilterPlus  />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[80%] rounded-[16px]">
        <DialogHeader>
          <DialogTitle>Filter Options</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {Object.entries(tags).map(([key, values]) => (
            <div key={key} className="grid gap-2">
              <Label htmlFor={key} className="capitalize">{key}</Label>
              <div className="flex flex-wrap gap-2">
                {values.map(tag => (
                  <span key={tag} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md flex items-center text-sm">
                    {tag}
                    <button onClick={() => removeTag(key, tag)} className="ml-2 text-secondary-foreground/50 hover:text-secondary-foreground">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ))}
          <div className="grid gap-2">
            <Label htmlFor="new-tag">Add New Tag</Label>
            <div className="flex gap-2">
              <Select onValueChange={setSelectedKey} value={selectedKey}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select key" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(tags).map(key => (
                    <SelectItem key={key} value={key} className="capitalize">{key}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="new-tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="New Tag"
              />
              <Button onClick={addTag} disabled={!newTag || !selectedKey}>Add</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </div>
    
  )
}

