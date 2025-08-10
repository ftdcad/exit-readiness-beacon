
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Building2, Car, DollarSign, ArrowRight } from "lucide-react";

export default function HoldCoStructurePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          HoldCo Structure
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Why a holding company matters when selling to PE - protect your assets and optimize your exit
        </p>
      </div>

      <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <AlertTitle>Core Message</AlertTitle>
        <AlertDescription>
          That beach condo in the company name? The building you own? Without a HoldCo, you just sold them. 
          With a HoldCo, you keep them and get ongoing income.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="problem" className="w-full">
        <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
          <TabsTrigger value="problem">The Problem</TabsTrigger>
          <TabsTrigger value="what">What is HoldCo</TabsTrigger>
          <TabsTrigger value="assets">What Goes In</TabsTrigger>
          <TabsTrigger value="money">Money Flow</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="mistakes">Mistakes</TabsTrigger>
        </TabsList>

        <TabsContent value="problem" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>The Problem - Without a HoldCo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="list-disc pl-5 space-y-2">
                <li>Beach condo titled to the company? Gone in the sale.</li>
                <li>Company-owned building? Sold unless you carve it out.</li>
                <li>Earnouts paid to wrong entity get taxed at higher rates.</li>
                <li>Company vehicles and boats? Included with OpCo.</li>
                <li>Future payments create tax and admin nightmares.</li>
              </ul>
              
              <Alert className="mt-4">
                <AlertTitle>Real Example</AlertTitle>
                <AlertDescription>
                  John owned a manufacturing company with a $3M building, $800k beach condo, and two boats ($200k). 
                  Without a HoldCo, PE would have taken everything. With a HoldCo, John kept the assets and 
                  leased the building back for $25k/month.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="what" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>What is a HoldCo?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="font-semibold">Simple explanation:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Entity that sits above your operating company</li>
                  <li>Parking lot for assets you want to keep</li>
                  <li>Mailbox for all seller payments after close</li>
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-3">
                <p className="font-semibold text-sm">Before/After Structure:</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Before (everything mixed):</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 bg-white dark:bg-gray-800 rounded">You</span>
                      <ArrowRight className="h-4 w-4" />
                      <span className="px-2 py-1 bg-white dark:bg-gray-800 rounded">OpCo (ops + assets)</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">After (clean separation):</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 bg-white dark:bg-gray-800 rounded">You</span>
                      <ArrowRight className="h-4 w-4" />
                      <span className="px-2 py-1 bg-white dark:bg-gray-800 rounded">HoldCo</span>
                      <ArrowRight className="h-4 w-4" />
                      <span className="px-2 py-1 bg-white dark:bg-gray-800 rounded">OpCo (clean)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assets" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Real Estate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Office, warehouse, manufacturing facility</li>
                  <li>Beach condo under company name</li>
                  <li>Any property the company owns</li>
                </ul>
                <p className="mt-3 text-sm text-green-600 dark:text-green-400">
                  Income: Lease back at $25k/mo = $300k/year
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Vehicles & Equipment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Company cars, trucks, luxury vehicles</li>
                  <li>Boats or aircraft</li>
                  <li>Heavy equipment or specialized gear</li>
                </ul>
                <p className="mt-3 text-sm text-green-600 dark:text-green-400">
                  Income: Lease equipment back to OpCo
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  IP & Brands
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Trademarks, patents, copyrights</li>
                  <li>Domain names and brand assets</li>
                </ul>
                <p className="mt-3 text-sm text-green-600 dark:text-green-400">
                  Income: License for 1-2% of revenue
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Investments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Excess cash beyond working capital</li>
                  <li>Investment accounts</li>
                  <li>Crypto or similar assets</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="money" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Money Flow After Sale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <p className="text-sm font-medium mb-2">Earnout Payments:</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-2 py-1 bg-white dark:bg-gray-800 rounded">PE Buyer</span>
                    <ArrowRight className="h-4 w-4" />
                    <span className="font-mono">$500k</span>
                    <ArrowRight className="h-4 w-4" />
                    <span className="px-2 py-1 bg-white dark:bg-gray-800 rounded">Your HoldCo</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-sm font-medium mb-2">Monthly Rent:</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-2 py-1 bg-white dark:bg-gray-800 rounded">OpCo</span>
                    <ArrowRight className="h-4 w-4" />
                    <span className="font-mono">$25k/mo</span>
                    <ArrowRight className="h-4 w-4" />
                    <span className="px-2 py-1 bg-white dark:bg-gray-800 rounded">PropCo (HoldCo)</span>
                  </div>
                </div>

                <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <p className="text-sm font-medium mb-2">Brand License:</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-2 py-1 bg-white dark:bg-gray-800 rounded">OpCo</span>
                    <ArrowRight className="h-4 w-4" />
                    <span className="font-mono">$10k/mo</span>
                    <ArrowRight className="h-4 w-4" />
                    <span className="px-2 py-1 bg-white dark:bg-gray-800 rounded">BrandCo (HoldCo)</span>
                  </div>
                </div>
              </div>

              <Alert>
                <AlertTitle>Quarterly Example</AlertTitle>
                <AlertDescription>
                  Total to HoldCo: $615k (Building rent: $75k, Equipment: $15k, Brand: $30k, Earnout: $500k)
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Formation Timeline (2-4 Weeks)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-semibold">Week 1</p>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Form HoldCo entity (LLC or Corp)</li>
                    <li>Obtain EIN online</li>
                    <li>Open dedicated bank account</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-semibold">Week 2</p>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Transfer titles for real estate and vehicles</li>
                    <li>Move equipment and update records</li>
                    <li>Transfer IP and trademarks</li>
                    <li>Draft lease and license agreements</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-semibold">Week 3-4</p>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Finalize agreements and consents</li>
                    <li>Ensure HoldCo is payee in purchase agreement</li>
                    <li>Set wire instructions</li>
                    <li>Prepare to close</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mistakes" className="space-y-4">
          <Alert className="border-red-500 dark:border-red-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Wrong Payee Entity</AlertTitle>
            <AlertDescription>
              Purchase agreement names you or OpCo instead of HoldCo. Cost: Very high taxes.
              Fix: Triple check that HoldCo LLC is the payee for all seller payments.
            </AlertDescription>
          </Alert>

          <Alert className="border-red-500 dark:border-red-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Assets Left in OpCo</AlertTitle>
            <AlertDescription>
              Building, vehicles, boats remain titled to OpCo at closing. Cost: You gave them away.
              Fix: Transfer everything 2+ weeks before close.
            </AlertDescription>
          </Alert>

          <Alert className="border-red-500 dark:border-red-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>No Written Leases</AlertTitle>
            <AlertDescription>
              Verbal promises aren't enforceable. 
              Fix: Put written agreements in place at market terms.
            </AlertDescription>
          </Alert>

          <Alert className="border-red-500 dark:border-red-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Commingled Funds</AlertTitle>
            <AlertDescription>
              Using personal or OpCo accounts for HoldCo flows defeats the purpose.
              Fix: Use a dedicated HoldCo bank account.
            </AlertDescription>
          </Alert>

          <Card className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
            <CardContent className="pt-6">
              <p className="font-semibold mb-2">Key Takeaway</p>
              <p className="text-sm">
                This can save you millions. Get your attorney and CPA involved now. 
                Form your HoldCo at least 2-4 weeks before closing. Make sure it's the 
                payee for all post-close payments.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                Educational content only. Not legal or tax advice.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
