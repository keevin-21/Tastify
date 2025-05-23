import { Edit, NumberInput, ReferenceInput, required, SelectInput, SimpleForm, TextInput } from "react-admin";

export const ChallengeEdit = () => {
    return (
        <Edit>
            <SimpleForm>
                <TextInput source="question" validate={required()} label="Question"/>
                <ReferenceInput source="lessonId" reference="lessons" />
                <SelectInput source="type" choices={[
                    { id: 'SELECT', name: 'Select' },
                    { id: 'ASSIST', name: 'Assist' }
                ]} validate={required()} />
                <NumberInput source="order" validate={required()} label="Order" />
            </SimpleForm>
        </Edit>
    );
};