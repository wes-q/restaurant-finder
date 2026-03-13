import { Textarea } from "@/components/ui/textarea";
import { Field, FieldDescription } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export default function () {
    return (
        <div className="m-6">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl mb-10">Search Places</h1>
            <div className="flex items-center justify-center">
                <div>
                    <Search />
                </div>
            </div>
        </div>
    );
}

function Search() {
    return (
        <Field>
            <FieldDescription>Enter your message below.</FieldDescription>
            <Textarea placeholder="Find me a cheap sushi restaurant in downtown Los Angeles that's open now." />
            <Button>Send message</Button>
        </Field>
    );
}
