
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

interface AddFolderDialogProps {
  onAddFolder: (parentId: string, folderName: string) => void;
  folderStructure: Array<{
    id: string;
    name: string;
    subfolders?: Array<{ id: string; name: string }>;
  }>;
}

export const AddFolderDialog: React.FC<AddFolderDialogProps> = ({ onAddFolder, folderStructure }) => {
  const [open, setOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [parentFolder, setParentFolder] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim() && parentFolder) {
      onAddFolder(parentFolder, folderName.trim());
      setFolderName('');
      setParentFolder('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Folder
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Folder</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="parent-folder">Parent Category</Label>
            <Select value={parentFolder} onValueChange={setParentFolder}>
              <SelectTrigger>
                <SelectValue placeholder="Select parent category" />
              </SelectTrigger>
              <SelectContent>
                {folderStructure.map(folder => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!folderName.trim() || !parentFolder}>
              Add Folder
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
