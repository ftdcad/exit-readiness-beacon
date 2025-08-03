import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Plus, Trash2, Car } from "lucide-react";

export interface VehicleAsset {
  id: string;
  type: 'SUV' | 'Truck' | 'Boat' | 'RV' | 'Jet Ski' | 'Motorcycle' | 'Other';
  details: string; // "2023 Ford F-150"
  annualCost: number;
  businessPercentage: number; // 0-100
  personalCost: number; // auto-calculated
  notes: string;
}

interface VehicleAssetTrackerProps {
  vehicleAssets: VehicleAsset[];
  onUpdateAssets: (assets: VehicleAsset[]) => void;
}

export default function VehicleAssetTracker({ vehicleAssets, onUpdateAssets }: VehicleAssetTrackerProps) {
  const [showAddForm, setShowAddForm] = useState(false);

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);

  const addVehicleAsset = () => {
    const newAsset: VehicleAsset = {
      id: `vehicle-${Date.now()}`,
      type: 'SUV',
      details: '',
      annualCost: 0,
      businessPercentage: 10,
      personalCost: 0,
      notes: ''
    };
    onUpdateAssets([...vehicleAssets, newAsset]);
    setShowAddForm(true);
  };

  const updateVehicleAsset = (id: string, field: keyof VehicleAsset, value: any) => {
    onUpdateAssets(vehicleAssets.map(asset => {
      if (asset.id === id) {
        const updated = { ...asset, [field]: value };
        // Auto-calculate personal cost when annual cost or business percentage changes
        if (field === 'annualCost' || field === 'businessPercentage') {
          updated.personalCost = Math.round(updated.annualCost * (100 - updated.businessPercentage) / 100);
        }
        return updated;
      }
      return asset;
    }));
  };

  const deleteVehicleAsset = (id: string) => {
    onUpdateAssets(vehicleAssets.filter(asset => asset.id !== id));
  };

  const totalPersonalCost = vehicleAssets.reduce((sum, asset) => sum + (asset.personalCost || 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Car className="h-5 w-5 text-primary" />
          <h4 className="font-semibold">Vehicle & Asset Inventory</h4>
          <span className="text-sm text-muted-foreground">
            ({vehicleAssets.length} items • {formatCurrency(totalPersonalCost)} personal use)
          </span>
        </div>
        <Button
          onClick={addVehicleAsset}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Vehicle/Asset
        </Button>
      </div>

      {vehicleAssets.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <Car className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h4 className="font-medium text-muted-foreground mb-2">No vehicles or assets tracked</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Add individual vehicles, boats, RVs, or other assets to create a detailed PE-ready inventory
            </p>
            <Button onClick={addVehicleAsset} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Asset
            </Button>
          </CardContent>
        </Card>
      )}

      {vehicleAssets.map((asset) => (
        <Card key={asset.id} className="bg-muted/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Car className="h-4 w-4" />
                {asset.details || `${asset.type} (Unnamed)`}
              </CardTitle>
              <Button
                onClick={() => deleteVehicleAsset(asset.id)}
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive/80"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Asset Type</label>
                <Select 
                  value={asset.type} 
                  onValueChange={(value) => updateVehicleAsset(asset.id, 'type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Truck">Truck</SelectItem>
                    <SelectItem value="Boat">Boat</SelectItem>
                    <SelectItem value="RV">RV</SelectItem>
                    <SelectItem value="Jet Ski">Jet Ski</SelectItem>
                    <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Year/Make/Model
                </label>
                <Input
                  value={asset.details}
                  onChange={(e) => updateVehicleAsset(asset.id, 'details', e.target.value)}
                  placeholder="e.g., 2023 Ford F-150 King Ranch"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Annual Cost (payments, insurance, fuel, maintenance)
                </label>
                <Input
                  type="number"
                  value={asset.annualCost || ''}
                  onChange={(e) => updateVehicleAsset(asset.id, 'annualCost', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Business Use: {asset.businessPercentage}%
                  <span className="text-muted-foreground ml-2">
                    (Personal: {100 - asset.businessPercentage}% = {formatCurrency(asset.personalCost)})
                  </span>
                </label>
                <Slider
                  value={[asset.businessPercentage]}
                  onValueChange={(value) => updateVehicleAsset(asset.id, 'businessPercentage', value[0])}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0% Business</span>
                  <span>100% Business</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Notes & Documentation
              </label>
              <Textarea
                value={asset.notes}
                onChange={(e) => updateVehicleAsset(asset.id, 'notes', e.target.value)}
                placeholder="Log details, business justification, or other notes for PE documentation..."
                rows={2}
              />
            </div>

            <div className="bg-primary/5 rounded-lg p-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Personal Use Add-Back:</span>
                <span className="font-semibold text-primary">
                  {formatCurrency(asset.personalCost)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {vehicleAssets.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Vehicle & Asset Add-Backs:</span>
              <span className="text-xl font-bold text-primary">
                {formatCurrency(totalPersonalCost)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              This amount represents the personal use portion of all tracked vehicles and assets
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}