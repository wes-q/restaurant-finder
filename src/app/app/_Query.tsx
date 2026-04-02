"use client";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldDescription } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export function Query() {
    return (
        <Field>
            <FieldDescription>Enter your message below.</FieldDescription>
            <Textarea placeholder="Find me a cheap sushi restaurant in downtown Los Angeles that's open now." />
            <Button>Send message</Button>
        </Field>
    );
}
