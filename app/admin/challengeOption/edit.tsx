import { BooleanInput, Edit, ReferenceInput, required, SimpleForm, TextInput } from "react-admin";

export const ChallengeOptionEdit = () => {
    return (
        <Edit>
            <SimpleForm>
                <TextInput source="text" validate={required()} label="Text"/>
                <BooleanInput source="correct" validate={required()} label="Correct Option" />
                <ReferenceInput source="challengeId" reference="challenges" />
                <TextInput source="imageSrc" label="Image" />
                <TextInput source="audioSrc" label="Audio" />
            </SimpleForm>
        </Edit>
    );
};